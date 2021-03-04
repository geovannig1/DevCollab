import { Server, Socket } from 'socket.io';

import Activity, { Avatar } from '../../models/Activity';

export default (io: Server, socket: Socket) => {
  socket.on('create activity file', async (data) => {
    try {
      const activity = await Activity.findOne({
        project: data.projectId,
      }).populate('messages.user', ['firstName', 'lastName', 'avatar']);

      if (activity) {
        activity.messages.push({
          avatar: Avatar.file,
          name: 'File',
          message: `${data.userName} created ${data.fileName} file`,
        });

        await activity.save();
        io.in(data.projectId).emit('receive activity message', activity);
      }
    } catch (err) {
      console.error(err);
    }
  });

  socket.on('update activity file', async (data) => {
    try {
      const activity = await Activity.findOne({
        project: data.projectId,
      }).populate('messages.user', ['firstName', 'lastName', 'avatar']);

      if (activity) {
        activity.messages.push({
          avatar: Avatar.file,
          name: 'File',
          message: `${data.userName} updated ${data.fileName} file`,
        });

        await activity.save();
        io.in(data.projectId).emit('receive activity message', activity);
      }
    } catch (err) {
      console.error(err);
    }
  });

  socket.on('delete activity file', async (data) => {
    try {
      const activity = await Activity.findOne({
        project: data.projectId,
      }).populate('messages.user', ['firstName', 'lastName', 'avatar']);

      if (activity) {
        activity.messages.push({
          avatar: Avatar.file,
          name: 'File',
          message: `${data.userName} deleted ${data.fileName} file`,
        });

        await activity.save();
        io.in(data.projectId).emit('receive activity message', activity);
      }
    } catch (err) {
      console.error(err);
    }
  });
};
