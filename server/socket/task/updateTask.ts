import { Socket } from 'socket.io';

import Task from '../../models/Task';

export default (socket: Socket) => {
  socket.on('update task', async (data) => {
    try {
      const projectTask = await Task.findOne({ project: data.projectId });

      if (projectTask) {
        projectTask.set(`tasks.${data.taskId}`, data.taskData);
        const updatedProjectTask = await projectTask.save();

        socket
          .to(data.projectId)
          .emit('updated update task', updatedProjectTask);
      }
    } catch (err) {
      console.error(err.message);
    }
  });
};
