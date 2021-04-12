import { Request, Response } from 'express';
import fs from 'fs/promises';

import cloudinary from '../config/cloudinaryConfig';
import { userExist, existNotReadOnly } from '../services/checkPermission';
import Project from '../models/Project';
import Discussion from '../models/Discussion';
import User from '../models/User';

//Load dicussions in the project
export const getDiscussions = async (req: Request, res: Response) => {
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

    const discussions = await Discussion.find({
      project: req.params.projectId,
    }).sort({
      date: '-1',
    });

    if (!discussions) {
      return res.status(404).json({ msg: 'No discussion found' });
    }

    res.status(200).json(discussions);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

//Load a discussion
export const getDiscussion = async (req: Request, res: Response) => {
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

    const discussion = await Discussion.findById(
      req.params.discussionId
    ).populate('comments.user', ['avatar', 'firstName', 'lastName']);

    if (!discussion) {
      return res.status(404).json({ msg: 'Discussion not found' });
    }

    res.status(200).json(discussion);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

//Create a new discussion
export const createDiscussion = async (req: Request, res: Response) => {
  try {
    const project = await Project.findById(req.params.projectId);
    const user = await User.findById(req.user);

    if (!project) {
      return res.status(404).json({ msg: 'Project not found' });
    }
    //Only user from the project and except user with ReadOnly access permission can create discussion
    const permission = existNotReadOnly(project, req.user);
    if (!permission) {
      return res.status(401).json({ msg: 'Unauthorized user' });
    }

    const { title, description } = req.body;

    const newDiscussion = await Discussion.create({
      project: req.params.projectId,
      title,
      description,
      creator: user?.email ?? '',
    });

    //Add attachment
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'attachment',
      });

      newDiscussion.attachment!.url = result?.secure_url;
      newDiscussion.attachment!.publicId = result?.public_id;
      await newDiscussion.save();

      //Delete file in the upload folder
      await fs.unlink(req.file.path);
    }

    res.status(201).json(newDiscussion);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

//Update a discussion
export const updateDiscussion = async (req: Request, res: Response) => {
  try {
    const project = await Project.findById(req.params.projectId);

    if (!project) {
      return res.status(404).json({ msg: 'Project not found' });
    }
    //Only user from the project and except user with ReadOnly access permission can update discussion
    const permission = existNotReadOnly(project, req.user);
    if (!permission) {
      return res.status(401).json({ msg: 'Unauthorized user' });
    }

    const { title, description } = req.body;

    const discussion = await Discussion.findById(req.params.discussionId);
    if (!discussion) {
      return res.status(404).json({ msg: 'Discussion not exist' });
    }

    //Update discussion
    if (typeof title !== 'undefined') discussion.title = title;
    if (typeof description !== 'undefined')
      discussion.description = description;

    //Update attachment
    if (req.file) {
      if (discussion.attachment?.publicId) {
        await cloudinary.uploader.destroy(discussion.attachment?.publicId);
      }

      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'attachment',
      });

      discussion.attachment!.url = result?.secure_url;
      discussion.attachment!.publicId = result?.public_id;

      await discussion.save();

      //Delete file in the upload folder
      await fs.unlink(req.file.path);
    }

    const updatedDiscussion = await discussion.save();

    res.status(200).json(updatedDiscussion);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

//Delete discussion
export const deleteDiscussion = async (req: Request, res: Response) => {
  try {
    const project = await Project.findById(req.params.projectId);

    if (!project) {
      return res.status(404).json({ msg: 'Project not found' });
    }
    //Only user from the project and except user with ReadOnly access permission can delete discussion
    const permission = existNotReadOnly(project, req.user);
    if (!permission) {
      return res.status(401).json({ msg: 'Unauthorized user' });
    }

    const discussion = await Discussion.findById(req.params.discussionId);
    if (!discussion) {
      return res.status(404).json({ msg: 'Discussion not exist' });
    }

    //Delete file in the cloudinary cloud
    if (discussion.attachment?.publicId) {
      await cloudinary.uploader.destroy(discussion.attachment?.publicId ?? '');
    }

    //Remove discussion
    await discussion.delete();

    res.status(200).json({ msg: 'Discussion deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};
