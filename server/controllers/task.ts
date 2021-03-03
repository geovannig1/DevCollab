import { Request, Response } from 'express';

import { userExist } from '../services/checkPermission';
import Task from '../models/Task';
import Project from '../models/Project';

export const getTasks = async (req: Request, res: Response) => {
  try {
    const project = await Project.findById(req.params.projectId);

    if (!project) {
      return res.status(404).json({ msg: 'Project not found' });
    }
    //Only user from the project can access
    const permission = userExist(project, req.user);
    if (!permission) {
      return res.status(401).json({ msg: 'Unauthorized user' });
    }

    const projectTask = await Task.findOne({ project: req.params.projectId })
      .populate('tasks.$*.members.user', ['email', 'avatar'])
      .populate('tasks.$*.comments.user', ['firstName', 'lastName', 'avatar']);

    res.status(200).json(projectTask);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

export const getTask = async (req: Request, res: Response) => {
  try {
    const project = await Project.findById(req.params.projectId);

    if (!project) {
      return res.status(404).json({ msg: 'Project not found' });
    }
    //Only user from the project can access
    const permission = userExist(project, req.user);
    if (!permission) {
      return res.status(401).json({ msg: 'Unauthorized user' });
    }

    const projectTask = await Task.findOne({
      project: req.params.projectId,
    })
      .populate('tasks.$*.members.user', ['email', 'avatar'])
      .populate('tasks.$*.comments.user', ['firstName', 'lastName', 'avatar']);

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
    console.error(err);
    res.status(500).send('Server error');
  }
};
