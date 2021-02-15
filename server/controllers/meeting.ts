import { Request, Response } from 'express';

import Project, { AccessPermission } from '../models/Project';
import Meeting from '../models/Meeting';

//Create a new room
export const createRoom = async (req: Request, res: Response) => {
  try {
    const project = await Project.findById(req.params.projectId);

    //Only user from the project and except user with ReadOnly access permission can create room
    const userExist = project?.members.filter(
      (member: any) => member.user?._id.toString() === req.user
    );
    if (
      userExist?.length === 0 ||
      userExist?.[0].accessPermission === AccessPermission.ReadOnly
    ) {
      return res.status(401).json({ msg: 'Unauthorized user' });
    }

    const { name, members } = req.body;

    const userMembers = members.map((member: any) => ({
      user: member.user._id,
    }));

    const newMeetingRoom = await Meeting.create({
      name,
      members: userMembers,
    });

    res.status(201).json(newMeetingRoom);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
