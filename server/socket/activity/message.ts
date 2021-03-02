import { Server, Socket } from 'socket.io';

import Activity from '../../models/Activity';

export default (io: Server, socket: Socket) => {
  socket.on('send activity message', async (data) => {
    let activity = await Activity.findOne({ project: data.projectId });

    if (activity) {
      activity.messages.push({ user: data.user, message: data.message });
      await activity.save();
    } else {
      activity = await Activity.create({
        project: data.projectId,
        messages: [{ user: data.user, message: data.message }],
      });
    }

    io.in(data.projectId).emit('receive activity message', activity);
  });
};
