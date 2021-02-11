import { Request, Response } from 'express';

import Task from '../models/Task';
import Project from '../models/Project';

export const getTasks = async (req: Request, res: Response) => {
  try {
    const project = await Project.findById(req.params.projectId);

    //Only user from the project can access
    const userExist = project?.members.filter(
      (member: any) => member.user?._id.toString() === req.user
    );
    if (userExist?.length === 0) {
      return res.status(401).json({ msg: 'Unauthorized user' });
    }

    const projectTask = await Task.findOne({ project: req.params.projectId })
      .populate('tasks.$*.members.user', ['email', 'avatar'])
      .populate('tasks.$*.comments.user', ['email', 'avatar']);

    if (!projectTask) {
      return res.status(404).json({ msg: 'Tasks not found' });
    }

    res.status(200).json(projectTask);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

export const getTask = async (req: Request, res: Response) => {
  try {
    const project = await Project.findById(req.params.projectId);

    //Only user from the project can access
    const userExist = project?.members.filter(
      (member: any) => member.user?._id.toString() === req.user
    );
    if (userExist?.length === 0) {
      return res.status(401).json({ msg: 'Unauthorized user' });
    }

    const projectTask = await Task.findOne({
      project: req.params.projectId,
    })
      .populate('tasks.$*.members.user', ['email', 'avatar'])
      .populate('tasks.$*.comments.user', ['email', 'avatar']);

    if (!projectTask) {
      return res.status(400).json({
        errors: [{ msg: 'Tasks with the given project id not exist' }],
      });
    }

    const task = projectTask.get(`tasks.${req.params.taskId}`);

    if (!task) {
      return res.status(400).json({ errors: [{ msg: 'Task not exist' }] });
    }

    res.status(200).json(task);
  } catch (err) {
    console.error(err.message);
  }
};
