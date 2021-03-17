import { Server, Socket } from 'socket.io';

import Activity, { Avatar } from '../../models/Activity';
import Project from '../../models/Project';
import User from '../../models/User';
import addNotification from '../../services/addNotification';

export default (io: Server, socket: Socket) => {
  socket.on('create activity meeting', async (data) => {
    try {
      const activity = await Activity.findOne({
        project: data.projectId,
      }).populate('messages.user', ['firstName', 'lastName', 'avatar']);

      //Find users email
      const users = await User.find({ _id: { $in: data.membersId } });
      const usersEmail = users.map((user) => user.email);

      //Find project members except logged in user
      const project = await Project.findById(data.projectId);
      const userProject = project?.members.map((member) => member.user);

      if (activity) {
        activity.messages.push({
          avatar: Avatar.meeting,
          name: 'Meeting Room',
          message: `**${data.userName.trim()}** invited **${usersEmail.join(
            ', '
          )}** to **${data.roomName.trim()}** meeting room`,
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

  socket.on('update activity meeting', async (data) => {
    try {
      const activity = await Activity.findOne({
        project: data.projectId,
      }).populate('messages.user', ['firstName', 'lastName', 'avatar']);

      //Find project members except logged in user
      const project = await Project.findById(data.projectId);
      const userProject = project?.members.map((member) => member.user);

      if (activity) {
        activity.messages.push({
          avatar: Avatar.meeting,
          name: 'Meeting Room',
          message: `**${data.userName.trim()}** updated **${data.roomName.trim()}** meeting room`,
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

  socket.on('delete activity meeting', async (data) => {
    try {
      const activity = await Activity.findOne({
        project: data.projectId,
      }).populate('messages.user', ['firstName', 'lastName', 'avatar']);

      //Find project members except logged in user
      const project = await Project.findById(data.projectId);
      const userProject = project?.members.map((member) => member.user);

      if (activity) {
        activity.messages.push({
          avatar: Avatar.meeting,
          name: 'Meeting Room',
          message: `**${data.userName.trim()}** deleted **${data.roomName.trim()}** meeting room`,
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
