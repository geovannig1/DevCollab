import { Server, Socket } from 'socket.io';

import Activity, { Avatar } from '../../models/Activity';
import Project from '../../models/Project';
import addNotification from '../../services/addNotification';

export default (io: Server, socket: Socket) => {
  socket.on('create activity discussion', async (data) => {
    try {
      const activity = await Activity.findOne({
        project: data.projectId,
      }).populate('messages.user', ['firstName', 'lastName', 'avatar']);

      //Find project members except logged in user
      const project = await Project.findById(data.projectId);
      const userProject = project?.members.map((member) => member.user);

      if (activity) {
        activity.messages.push({
          avatar: Avatar.discussion,
          name: 'Discussion',
          message: `**${data.userName.trim()}** created **${data.discussionName.trim()}** discussion`,
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

  socket.on('update activity discussion', async (data) => {
    try {
      const activity = await Activity.findOne({
        project: data.projectId,
      }).populate('messages.user', ['firstName', 'lastName', 'avatar']);

      //Find project members except logged in user
      const project = await Project.findById(data.projectId);
      const userProject = project?.members.map((member) => member.user);

      if (activity) {
        activity.messages.push({
          avatar: Avatar.discussion,
          name: 'Discussion',
          message: `**${data.userName.trim()}** updated **${data.discussionName.trim()}** discussion`,
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

  socket.on('delete activity discussion', async (data) => {
    try {
      const activity = await Activity.findOne({
        project: data.projectId,
      }).populate('messages.user', ['firsName', 'lastName', 'avatar']);

      //Find project members except logged in user
      const project = await Project.findById(data.projectId);
      const userProject = project?.members.map((member) => member.user);

      if (activity) {
        activity.messages.push({
          avatar: Avatar.discussion,
          name: 'Discussion',
          message: `**${data.userName.trim()}** deleted **${data.discussionName.trim()}** discussion`,
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
