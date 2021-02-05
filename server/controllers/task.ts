import { Request, Response } from 'express';

import Task from '../models/Task';
import Project from '../models/Project';

export const getTask = async (req: Request, res: Response) => {
  try {
    const task = await Task.findOne({ project: req.params.projectId });
    const project = await Project.findById(req.params.projectId);

    //Only user from the project can access
    const userExist = project?.members.filter(
      (member: any) => member.user?._id.toString() === req.user
    );
    if (userExist?.length === 0) {
      return res.status(401).json({ msg: 'Unauthorized user' });
    }

    res.status(200).json(task);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
