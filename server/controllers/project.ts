import { Request, Response } from 'express';

import Project, { Member, AccessPermission } from '../models/Project';
import User from '../models/User';

//Create a new project
export const createProject = async (req: Request, res: Response) => {
  try {
    const { name, description, members = [] } = req.body;

    const user = await User.findById(req.user);

    //Add signed in user as member
    let userMember: Member[] = [];
    if (user?.id && members.length === 0) {
      userMember = [
        { user: user.id, accessPermission: AccessPermission.Admin },
      ];
    }

    const defaultMembers: Member[] = [...members, ...userMember];

    await Project.create({
      name,
      description,
      members: defaultMembers,
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
