import { Server, Socket } from 'socket.io';

import Activity, { Avatar } from '../../models/Activity';

export default (io: Server, socket: Socket) => {
  socket.on('create activity meeting', async (data) => {
    try {
      const activity = await Activity.findOne({
        project: data.projectId,
      }).populate('messages.user', ['firstName', 'lastName', 'avatar']);

      if (activity) {
        activity.messages.push({
          avatar: Avatar.meeting,
          name: 'Meeting Room',
          message: `${data.userName} created ${data.roomName} meeting room`,
        });

        await activity.save();
        io.in(data.projectId).emit('receive activity message', activity);
      }
    } catch (err) {
      console.error(err);
    }
  });
};
