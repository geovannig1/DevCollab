import { Request, Response } from 'express';

import { userExist } from '../services/checkPermission';
import Project from '../models/Project';
import Activity from '../models/Activity';

export const getActivities = async (req: Request, res: Response) => {
  try {
    const project = await Project.findById(req.params.projectId);

    //Only user from the project can get activities
    if (project) {
      userExist(req, res, project);
    }

    const activity = await Activity.findOne({ project: req.params.projectId });

    if (!activity) {
      return res.status(404).json({ msg: 'Activity not found' });
    }

    res.status(200).json(activity);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
