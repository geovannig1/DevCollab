import { Server, Socket } from 'socket.io';

import Activity, { Avatar } from '../../models/Activity';
import Project from '../../models/Project';
import addNotification from '../../services/addNotification';

export default (io: Server, socket: Socket) => {
  socket.on('create activity note', async (data) => {
    try {
      const activity = await Activity.findOne({
        project: data.projectId,
      }).populate('messages.user', ['firstName', 'lastName', 'avatar']);

      //Find project members except logged in user
      const project = await Project.findById(data.projectId);
      const userProject = project?.members.map((member) => member.user);

      if (activity) {
        activity.messages.push({
          avatar: Avatar.note,
          name: 'Note',
          message: `**${data.userName.trim()}** created **${data.noteName.trim()}** note`,
        });

        //Add notification
        addNotification(activity, data, userProject);

        await activity.save();
        io.in(data.projectId).emit('receive activity message', activity);
      }
    } catch (err) {
      console.error(err);
    }
  });

  socket.on('update activity note', async (data) => {
    try {
      const activity = await Activity.findOne({
        project: data.projectId,
      }).populate('messages.user', ['firstName', 'lastName', 'avatar']);

      //Find project members except logged in user
      const project = await Project.findById(data.projectId);
      const userProject = project?.members.map((member) => member.user);

      if (activity) {
        activity.messages.push({
          avatar: Avatar.note,
          name: 'Note',
          message: `**${data.userName.trim()}** updated **${data.noteName.trim()}** note`,
        });

        //Add notification
        addNotification(activity, data, userProject);

        await activity.save();
        io.in(data.projectId).emit('receive activity message', activity);
      }
    } catch (err) {
      console.error(err);
    }
  });

  socket.on('delete activity note', async (data) => {
    try {
      const activity = await Activity.findOne({
        project: data.projectId,
      }).populate('messages.user', ['firstName', 'lastName', 'avatar']);

      //Find project members except logged in user
      const project = await Project.findById(data.projectId);
      const userProject = project?.members.map((member) => member.user);

      if (activity) {
        activity.messages.push({
          avatar: Avatar.note,
          name: 'Note',
          message: `**${data.userName.trim()}** deleted **${data.noteName.trim()}** note`,
        });

        //Add notification
        addNotification(activity, data, userProject);

        await activity.save();
        io.in(data.projectId).emit('receive activity message', activity);
      }
    } catch (err) {
      console.error(err);
    }
  });
};
