import { Request, Response } from 'express';

import Project from '../models/Project';
import { existNotReadOnly, userExist } from '../services/checkPermission';
import Meeting from '../models/Meeting';

//Load all rooms
export const getRooms = async (req: Request, res: Response) => {
  try {
    const project = await Project.findById(req.params.projectId);

    if (!project) {
      return res.status(404).json({ msg: 'Project not found' });
    }
    //Only user from the project can access rooms
    const permission = userExist(project, req.user);
    if (!permission) {
      return res.status(401).json({ msg: 'Unauthorized user' });
    }

    const meeting = await Meeting.find({ project: req.params.projectId }).sort({
      date: '-1',
    });
    if (!meeting) {
      return res.status(404).json({ msg: 'Meeting rooms not exist' });
    }

    res.status(200).json(meeting);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

//Get a room
export const getRoom = async (req: Request, res: Response) => {
  try {
    const meeting = await Meeting.findById(
      req.params.meetingId
    ).populate('members.user', ['firstName', 'lastName']);

    //Only invited user can access
    const userExist = meeting?.members.filter(
      (member) => member.user?._id.toString() === req.user
    );
    if (userExist?.length === 0) {
      return res.status(401).json({ msg: 'Unauthorized user' });
    }

    res.status(200).json(meeting);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

//Create a new room
export const createRoom = async (req: Request, res: Response) => {
  try {
    const project = await Project.findById(req.params.projectId);

    if (!project) {
      return res.status(404).json({ msg: 'Project not found' });
    }
    //Only user from the project and except user with ReadOnly access permission can create room
    const permission = existNotReadOnly(project, req.user);
    if (!permission) {
      return res.status(401).json({ msg: 'Unauthorized user' });
    }

    const { name, members } = req.body;

    const userMembers = members.map((member: any) => ({
      user: member.user._id,
    }));

    const newMeetingRoom = await Meeting.create({
      project: req.params.projectId,
      name,
      members: userMembers,
    });

    res.status(201).json(newMeetingRoom);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

//Update a room
export const updateRoom = async (req: Request, res: Response) => {
  try {
    const project = await Project.findById(req.params.projectId);

    if (!project) {
      return res.status(404).json({ msg: 'Project not found' });
    }
    //Only user from the project and except user with ReadOnly access permission can update room
    const permission = existNotReadOnly(project, req.user);
    if (!permission) {
      return res.status(401).json({ msg: 'Unauthorized user' });
    }

    const meeting = await Meeting.findById(req.params.meetingId);

    if (!meeting) {
      return res.status(404).json({ msg: 'Meeting room not exist' });
    }

    const { name, members } = req.body;

    //Update meeting room
    if (typeof name !== 'undefined') meeting.name = name;
    if (typeof members !== 'undefined') meeting.members = members;

    const updatedMeeting = await meeting.save();

    res.status(200).json(updatedMeeting);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

//Delete a room
export const deleteRoom = async (req: Request, res: Response) => {
  try {
    const project = await Project.findById(req.params.projectId);

    if (!project) {
      return res.status(404).json({ msg: 'Project not found' });
    }
    //Only user from the project and except user with ReadOnly access permission can delete room
    const permission = existNotReadOnly(project, req.user);
    if (!permission) {
      return res.status(401).json({ msg: 'Unauthorized user' });
    }

    const meeting = await Meeting.findById(req.params.meetingId);

    if (!meeting) {
      return res.status(404).json({ msg: 'Meeting not found' });
    }

    meeting.delete();

    res.status(200).json({ msg: 'Room deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};
