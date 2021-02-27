import { Request, Response } from 'express';

import Note from '../models/Note';
import Project, { AccessPermission } from '../models/Project';

//Get all notes
export const getNotes = async (req: Request, res: Response) => {
  try {
    const project = await Project.findById(req.params.projectId);

    //Only user from the project can see notes
    const userExist = project?.members.filter(
      (member: any) => member.user?._id.toString() === req.user
    );
    if (userExist?.length === 0) {
      return res.status(401).json({ msg: 'Unauthorized user' });
    }

    const note = await Note.find({
      project: req.params.projectId,
    }).populate('user', ['firstName', 'lastName']);
    res.status(200).json(note);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

//Create a new note
export const createNote = async (req: Request, res: Response) => {
  try {
    const project = await Project.findById(req.params.projectId);

    //Only user from the project and except user with ReadOnly access permission can create note
    const userExist = project?.members.filter(
      (member: any) => member.user?._id.toString() === req.user
    );
    if (
      userExist?.length === 0 ||
      userExist?.[0].accessPermission === AccessPermission.ReadOnly
    ) {
      return res.status(401).json({ msg: 'Unauthorized user' });
    }

    const { title, contents } = req.body;

    const note = await Note.create({
      project: req.params.projectId,
      user: req.user?.toString() ?? '',
      title,
      contents,
    });

    res.status(201).json(note);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

//Update a note
export const updateNote = async (req: Request, res: Response) => {
  try {
    const project = await Project.findById(req.params.projectId);

    //Only user from the project and except user with ReadOnly access permission can update note
    const userExist = project?.members.filter(
      (member: any) => member.user?._id.toString() === req.user
    );
    if (
      userExist?.length === 0 ||
      userExist?.[0].accessPermission === AccessPermission.ReadOnly
    ) {
      return res.status(401).json({ msg: 'Unauthorized user' });
    }

    const note = await Note.findById(req.params.noteId);

    if (!note) {
      return res.json(404).json({ msg: 'Note not found' });
    }

    const { title, contents } = req.body;

    if (title) note.title = title;
    if (contents) note.contents = contents;

    const updatedNote = await note.save();

    res.status(200).json(updatedNote);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
