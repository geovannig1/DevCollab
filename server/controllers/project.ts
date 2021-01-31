import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import Project, { Member, AccessPermission } from '../models/Project';
import sendEmail from '../services/sendEmail';
import User from '../models/User';

//Create a new project
export const createProject = async (req: Request, res: Response) => {
  try {
    let { name, description, members } = req.body;

    //Remove white space
    name = name.trim();

    const user = await User.findById(req.user);

    //Add signed in user as member
    let userMember: Member[] = [];
    if (user?.id) {
      userMember = [
        { user: user.id, accessPermission: AccessPermission.Admin },
      ];
    }

    const project = await Project.create({
      name,
      description,
      members: userMember,
    });

    await project
      .populate({
        path: 'members.user',
        select: ['firstName', 'lastName', 'email'],
      })
      .execPopulate();

    //Create and send invitation email
    sendEmail(members, user, name, project);

    res.status(201).json(project);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

//Load user projects
export const getProjects = async (req: Request, res: Response) => {
  try {
    const projects = await Project.find({
      members: { $elemMatch: { user: req.user } },
    }).populate('members.user', ['firstName', 'lastName', 'email']);

    //If user added to project by email
    const user = await User.findById(req.user);
    const projectsEmail = await Project.find({
      members: { $elemMatch: { email: user?.email } },
    });
    //Check if user with the email exist
    if (projectsEmail.length > 0) {
      for (const project of projectsEmail) {
        //Save the current user as a member data
        const userMember = project.members.filter(
          (member) => member.email === user?.email
        )[0];

        //Remove the user data in the project members and replace it with a real account
        project.members = project.members.filter(
          (member) => member.email !== user?.email
        );
        project.members.push({
          user: user?.id,
          accessPermission: userMember.accessPermission,
        });

        await project.save();
      }

      //Load the newly updated project
      const projects = await Project.find({
        members: { $elemMatch: { user: req.user } },
      }).populate('members.user', ['firstName', 'lastName', 'email']);

      return res.status(200).json(projects);
    }

    res.status(200).json(projects);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

//Update project
export const updateProject = async (req: Request, res: Response) => {
  try {
    const { name, description, members } = req.body;

    const project = await Project.findById(req.params.projectId);
    const user = await User.findById(req.user);

    if (!project) {
      return res.status(404).json({ msg: 'Project not found' });
    }

    //Check if the update request from the admin project
    const member = project?.members.find(
      (member) => member.user?.toString() === req.user
    );
    if (member?.accessPermission !== AccessPermission.Admin) {
      return res.status(401).json({ msg: 'Unauthorized user' });
    }

    await project
      .populate({ path: 'members.user', select: ['email'] })
      .execPopulate();

    //---- Find new user from request body and send invitation email----//
    //Get project members email
    const projectEmail = project.members.map(
      (member: any) => member.user.email
    );
    //find new user from request body
    const newMembers = members.filter(
      (member: any) => !projectEmail.includes(member.email)
    );

    //Send email to new members
    if (newMembers.length > 0) {
      sendEmail(newMembers, user, name, project);
    }

    //find current updated member from request body
    let currentMembers: Member[];
    if (members.length > 0) {
      currentMembers = project.members.filter((projectMember: any) => {
        return members.map((member: any) => {
          if (member.email.includes(projectMember.user.email)) {
            return (projectMember.accessPermission = member.accessPermission);
          }
        });
      });
    } else {
      currentMembers = project.members.filter(
        (member: any) => member.user.id === req.user
      );
    }

    //Update data
    if (name) project.name = name.trim();
    if (description) project.description = description.trim();
    if (currentMembers) project.members = currentMembers;

    const updatedProject = await (await project?.save())
      .populate({
        path: 'members.user',
        select: ['firstName', 'lastName', 'email'],
      })
      .execPopulate();

    res.status(200).json(updatedProject);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

//Delete project
export const deleteProject = async (req: Request, res: Response) => {
  try {
    const project = await Project.findById(req.params.projectId);

    //Check if delete request from admin project
    const member = project?.members.find(
      (member) => member.user?.toString() === req.user
    );
    if (member?.accessPermission !== AccessPermission.Admin) {
      return res.status(401).json({ errors: { msg: 'Unauthorized user' } });
    }

    await project?.remove();

    res.status(200).json({ msg: 'Project deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

//Confirm project invitation
export const confirmInvitation = async (req: Request, res: Response) => {
  try {
    const token = req.params.token;
    const decoded: any = jwt.verify(token, process.env.JWT_NODEMAILER_SECRET!);

    const { member } = decoded;
    console.log(decoded);

    const project = await Project.findById(member.projectId);

    //Check if invited member already have an account
    const user = await User.findOne({ email: member.email });
    if (user?.id) {
      //Check if invited member already in the project
      const userExist = project?.members.filter(
        (member) => member.user === user.id
      );

      if (userExist && userExist.length > 0) {
        return res.status(400).json({ msg: 'User already in the project' });
      }

      project?.members.push({
        user: user.id,
        accessPermission: member.accessPermission,
      });

      await project?.save();
      return res.status(200).redirect(`/projects/${member.projectId}`);
    }

    //When member doesn't have account
    project?.members.push({
      email: member.email,
      accessPermission: member.accessPermission,
    });

    await project?.save();
    res.status(200).redirect(`/projects/${member.projectId}`);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
