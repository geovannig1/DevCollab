import { Request, Response } from 'express';

import { userExist } from '../services/checkPermission';
import Project from '../models/Project';
import Activity from '../models/Activity';

export const getActivity = async (req: Request, res: Response) => {
  try {
    const project = await Project.findById(req.params.projectId);

    if (!project) {
      return res.status(404).json({ msg: 'Project not found' });
    }

    //Only user from the project can get activities
    const permission = userExist(project, req.user);
    if (!permission) {
      return res.status(401).json({ msg: 'Unauthorized user' });
    }

    const activity = await Activity.findOne({
      project: req.params.projectId,
    }).populate('messages.user', ['firstName', 'lastName', 'avatar']);

    if (!activity) {
      return res.status(404).json({ msg: 'Activity not found' });
    }

    res.status(200).json(activity);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

//Remove user activity notification
export const removeNotification = async (req: Request, res: Response) => {
  try {
    const project = await Project.findById(req.params.projectId);

    if (!project) {
      return res.status(404).json({ msg: 'Project not found' });
    }

    //Only user from the project can remove notification
    const permission = userExist(project, req.user);
    if (!permission) {
      return res.status(401).json({ msg: 'Unauthorized user' });
    }

    const activity = await Activity.findOne({
      project: req.params.projectId,
    }).populate('messages.user', ['firstName', 'lastName', 'avatar']);

    if (!activity) {
      return res.status(404).json({ msg: 'Activity not found' });
    }

    const userNotification = activity.notifications?.filter(
      (notification) => notification.user.toString() !== req.user
    );

    activity.notifications = userNotification;
    await activity.save();

    res.status(200).json(activity);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};
