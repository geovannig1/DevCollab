import { Request, Response } from 'express';
import fs from 'fs/promises';

import cloudinary from '../config/cloudinaryConfig';
import Project, { AccessPermission } from '../models/Project';
import Discussion from '../models/Discussion';

export const createDiscussion = async (req: Request, res: Response) => {
  try {
    const project = await Project.findById(req.params.projectId);

    //Only user from the project and except user with ReadOnly access permission can create discussion
    const userExist = project?.members.filter(
      (member: any) => member.user?._id.toString() === req.user
    );
    if (
      userExist?.length === 0 ||
      userExist?.[0].accessPermission === AccessPermission.ReadOnly
    ) {
      return res.status(401).json({ msg: 'Unauthorized user' });
    }

    const { title, description } = req.body;

    const newDiscussion = await Discussion.create({
      project: req.params.projectId,
      title,
      description,
    });

    //Add attachment
    if (req.file) {
      cloudinary.uploader.upload(
        req.file.path,
        { folder: 'attachment' },
        async (err, result) => {
          newDiscussion.attachment = result?.secure_url;
          await newDiscussion.save();

          //Delete image in the upload folder
          await fs.unlink(req.file.path);

          res.status(201).json(newDiscussion);
        }
      );
      return;
    }

    res.status(201).json(newDiscussion);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
