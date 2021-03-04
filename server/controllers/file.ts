import { Request, Response } from 'express';
import fs from 'fs/promises';

import Project from '../models/Project';
import { existNotReadOnly, userExist } from '../services/checkPermission';
import File from '../models/File';
import cloudinary from '../config/cloudinaryConfig';

//Load all files
export const getFiles = async (req: Request, res: Response) => {
  try {
    const project = await Project.findById(req.params.projectId);

    if (!project) {
      return res.status(404).json({ msg: 'Project not found' });
    }
    //Only user from the project and can load files
    const permission = userExist(project, req.user);
    if (!permission) {
      return res.status(401).json({ msg: 'Unauthorized user' });
    }

    const file = await File.find({
      project: req.params.projectId,
    })
      .populate('user', ['firstName', 'lastName'])
      .sort({
        date: '-1',
      });

    if (!file) {
      return res.status(404).json({ msg: 'File not found' });
    }

    res.status(200).json(file);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

//Load a file
export const getFile = async (req: Request, res: Response) => {
  try {
    const project = await Project.findById(req.params.projectId);

    if (!project) {
      return res.status(404).json({ msg: 'Project not found' });
    }
    //Only user from the project and can load a file
    const permission = userExist(project, req.user);
    if (!permission) {
      return res.status(401).json({ msg: 'Unauthorized user' });
    }

    const file = await File.findById(req.params.fileId).populate('user', [
      'firstName',
      'lastName',
    ]);

    if (!file) {
      return res.status(404).json({ msg: 'File not found' });
    }

    res.status(200).json(file);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

//Create a new file
export const createFile = async (req: Request, res: Response) => {
  try {
    const project = await Project.findById(req.params.projectId);

    if (!project) {
      return res.status(404).json({ msg: 'Project not found' });
    }
    //Only user from the project and except user with ReadOnly access permission can create file
    const permission = existNotReadOnly(project, req.user);
    if (!permission) {
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
      user: req.user?.toString() ?? '',
    });

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'file',
      });

      newFile.file!.url = result?.secure_url;
      newFile.file!.publicId = result?.public_id;
      await (await newFile.save())
        .populate({
          path: 'user',
          select: ['firstName', 'lastName'],
        })
        .execPopulate();

      //Delete file in the upload folder
      await fs.unlink(req.file.path);
    }

    res.status(201).json(newFile);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

//Update a file
export const updateFile = async (req: Request, res: Response) => {
  try {
    const project = await Project.findById(req.params.projectId);

    if (!project) {
      return res.status(404).json({ msg: 'Project not found' });
    }
    //Only user from the project and except user with ReadOnly access permission can update file
    const permission = existNotReadOnly(project, req.user);
    if (!permission) {
      return res.status(401).json({ msg: 'Unauthorized user' });
    }

    const updateFile = await File.findById(req.params.fileId);

    if (!updateFile) {
      return res.status(404).json({ msg: 'File not found' });
    }

    const { name } = req.body;

    if (typeof name !== 'undefined') updateFile.name = name;

    if (req.file) {
      //Delete previous file
      await cloudinary.uploader.destroy(updateFile.file.publicId);

      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'file',
      });

      updateFile.file!.url = result?.secure_url;
      updateFile.file!.publicId = result?.public_id;
      await updateFile.save();

      //Delete file in the upload folder
      await fs.unlink(req.file.path);
    }

    const updatedFile = await (await updateFile.save())
      .populate({
        path: 'user',
        select: ['firstName', 'lastName'],
      })
      .execPopulate();

    res.status(200).json(updatedFile);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

//Delete a file
export const deleteFile = async (req: Request, res: Response) => {
  try {
    const project = await Project.findById(req.params.projectId);

    if (!project) {
      return res.status(404).json({ msg: 'Project not found' });
    }
    //Only user from the project and except user with ReadOnly access permission can delete file
    const permission = existNotReadOnly(project, req.user);
    if (!permission) {
      return res.status(401).json({ msg: 'Unauthorized user' });
    }

    const deletedFile = await File.findById(req.params.fileId);

    if (!deletedFile) {
      return res.status(404).json({ msg: 'File not found' });
    }

    //Delete file in the cloudinary
    await cloudinary.uploader.destroy(deletedFile.file.publicId);

    //Delete the file
    await deletedFile.delete();

    res.status(200).json({ msg: 'File deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};
