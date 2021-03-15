import { Server, Socket } from 'socket.io';

import Activity, { Avatar } from '../../models/Activity';
import Project from '../../models/Project';

export default (io: Server, socket: Socket) => {
  socket.on('create activity note', async (data) => {
    try {
      const activity = await Activity.findOne({
        project: data.projectId,
      }).populate('messages.user', ['firstName', 'lastName', 'avatar']);

      //Find project members except logged in user
      const project = await Project.findById(data.projectId);
      const userProject = project?.members
        .map((member) => member.user)
        .filter((member) => member?.toString() !== data.userId);

      if (activity) {
        activity.messages.push({
          avatar: Avatar.note,
          name: 'Note',
          message: `**${data.userName.trim()}** created **${data.noteName.trim()}** note`,
        });

        //Add notification
        userProject?.map((user, index) => {
          if (
            user &&
            (!activity.notifications || !activity.notifications[index]?.user)
          ) {
            activity.notifications?.push({ user: user, totalNotifications: 1 });
          } else if (
            activity.notifications &&
            activity.notifications[index]?.user
          ) {
            activity.notifications[index].totalNotifications =
              activity.notifications[index].totalNotifications + 1;
          }
          return activity.notifications;
        });

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
      const userProject = project?.members
        .map((member) => member.user)
        .filter((member) => member?.toString() !== data.userId);

      if (activity) {
        activity.messages.push({
          avatar: Avatar.note,
          name: 'Note',
          message: `**${data.userName.trim()}** updated **${data.noteName.trim()}** note`,
        });

        //Add notification
        userProject?.map((user, index) => {
          if (
            user &&
            (!activity.notifications || !activity.notifications[index]?.user)
          ) {
            activity.notifications?.push({ user: user, totalNotifications: 1 });
          } else if (
            activity.notifications &&
            activity.notifications[index]?.user
          ) {
            activity.notifications[index].totalNotifications =
              activity.notifications[index].totalNotifications + 1;
          }
          return activity.notifications;
        });

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
      const userProject = project?.members
        .map((member) => member.user)
        .filter((member) => member?.toString() !== data.userId);

      if (activity) {
        activity.messages.push({
          avatar: Avatar.note,
          name: 'Note',
          message: `**${data.userName.trim()}** deleted **${data.noteName.trim()}** note`,
        });

        //Add notification
        userProject?.map((user, index) => {
          if (
            user &&
            (!activity.notifications || !activity.notifications[index]?.user)
          ) {
            activity.notifications?.push({ user: user, totalNotifications: 1 });
          } else if (
            activity.notifications &&
            activity.notifications[index]?.user
          ) {
            activity.notifications[index].totalNotifications =
              activity.notifications[index].totalNotifications + 1;
          }
          return activity.notifications;
        });

        await activity.save();
        io.in(data.projectId).emit('receive activity message', activity);
      }
    } catch (err) {
      console.error(err);
    }
  });
};
