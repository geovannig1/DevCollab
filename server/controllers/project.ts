import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import Project, { Member, AccessPermission } from '../models/Project';
import nodemailer from '../services/nodemailer';
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

    //Create and send invitation email
    members.map((member: any) => {
      const payload = {
        member: {
          projectName: name,
          projectId: project.id,
          email: member.email,
          accessPermission: member.accessPermission,
        },
      };

      const token = jwt.sign(payload, process.env.JWT_NODEMAILER_SECRET!);

      let url: string;
      if (process.env.NODE_ENV === 'production') {
        url = `http://<something>/api/projects/invitation/${token}`;
      } else {
        url = `http://localhost:3000/api/projects/invitation/${token}`;
      }

      //Send email
      nodemailer(
        member.email,
        `${name} - Project Invitation`,
        `
        <div style='font-size: 16px; margin: 0; background: #f5f5f5;padding: 10px 200px;'>
          <div style='height: 180px;background: white; padding: 20px;'>
            <h3 style='color:black;'>Hi ${member.email},</h3>
            <p style='font-size: 15px; color: black; margin:0;'>${user?.email} has invited you to <b>${name}</b> project, <br/>
            click the button below to join the project: </p> 
            <a href="${url}">
              <button style='background-color: #4463CC;color: white; height: 40px; width: 90px; border: none; cursor: pointer; margin: 10px 0;'>
              Join
              </button>
            </a> 
          </div>
        </div>
        `
      );
    });

    res.status(201).json({ msg: 'Project successfully created' });
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

    res.status(200).json(projects);
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
    }

    //When member doesn't have account
    const userExist = project?.members.filter(
      (projectMember) => projectMember.email === member.email
    );
    if (userExist && userExist.length > 0) {
      return res.status(400).json({ msg: 'User already in the project' });
    }

    project?.members.push({
      email: member.email,
      accessPermission: member.accessPermission,
    });

    await project?.save();
    res.status(200).redirect(`/projects/${member.projectId}`);
  } catch (err) {
    res.status(500).send('Server error');
  }
};
