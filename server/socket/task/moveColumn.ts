import { Server, Socket } from 'socket.io';

import Task from '../../models/Task';

export default (io: Server, socket: Socket) => {
  socket.on('move column', async (data) => {
    try {
      const task = await Task.findOne({ project: data.projectId });

      if (task) {
        task.columnOrder = data.columnOrder;
      }

      const newColumnOrder = await task?.save();

      //Send the data to client
      io.to(data.projectId).emit('task update', newColumnOrder);
    } catch (err) {
      console.error(err.message);
    }
  });
};
