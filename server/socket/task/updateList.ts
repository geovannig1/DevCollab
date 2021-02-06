import { Server, Socket } from 'socket.io';

import Task from '../../models/Task';

export default (io: Server, socket: Socket) => {
  socket.on('update list', async (data) => {
    try {
      const projectTask = await Task.findOne({ project: data.projectId });
      if (projectTask) {
        const taskIds = projectTask.get(`columns.${data.listId}`).taskIds;
        projectTask.set(`columns.${data.listId}`, {
          id: data.listId,
          title: data.listData,
          taskIds: taskIds,
        });

        const updatedProjectTask = await projectTask.save();
        io.in(data.projectId).emit('updated update list', updatedProjectTask);
      }
    } catch (err) {
      console.error(err.message);
    }
  });
};
