import { Request, Response } from 'express';
import fs from 'fs/promises';

import Project, { AccessPermission } from '../models/Project';
import File from '../models/File';
import cloudinary from '../config/cloudinaryConfig';

//Create a new file
export const createFile = async (req: Request, res: Response) => {
  try {
    const project = await Project.findById(req.params.projectId);

    //Only user from the project and except user with ReadOnly access permission can create file
    const userExist = project?.members.filter(
      (member: any) => member.user?._id.toString() === req.user
    );
    if (
      userExist?.length === 0 ||
      userExist?.[0].accessPermission === AccessPermission.ReadOnly
    ) {
      return res.status(401).json({ msg: 'Unauthorized user' });
    }

    const { name } = req.body;

    const newFile = await File.create({
      project: req.params.projectId,
      name,
      file: {
        publicId: '',
        url: '',
      },
    });

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'file',
        resource_type: 'image',
        format: 'png',
      });

      newFile.file!.url = result?.secure_url;
      newFile.file!.publicId = result?.public_id;
      await newFile.save();

      //Delete file in the upload folder
      await fs.unlink(req.file.path);
    }

    res.status(201).json(newFile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
