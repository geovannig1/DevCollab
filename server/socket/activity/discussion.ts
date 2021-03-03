import { Server, Socket } from 'socket.io';

import Activity, { Avatar } from '../../models/Activity';

export default (io: Server, socket: Socket) => {
  socket.on('create activity discussion', async (data) => {
    try {
      const activity = await Activity.findOne({
        project: data.projectId,
      }).populate('messages.user', ['firstName', 'lastName', 'avatar']);

      if (activity) {
        activity.messages.push({
          avatar: Avatar.discussion,
          name: 'Discussion',
          message: `${data.userName} created ${data.discussionName} discussion`,
        });

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

      if (activity) {
        activity.messages.push({
          avatar: Avatar.discussion,
          name: 'Discussion',
          message: `${data.userName} updated ${data.discussionName} discussion`,
        });

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

      if (activity) {
        activity.messages.push({
          avatar: Avatar.discussion,
          name: 'Discussion',
          message: `${data.userName} deleted ${data.discussionName} discussion`,
        });

        await activity.save();
        io.in(data.projectId).emit('receive activity message', activity);
      }
    } catch (err) {
      console.error(err);
    }
  });
};
