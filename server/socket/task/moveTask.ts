import { Server, Socket } from 'socket.io';

import Task from '../../models/Task';

export default (io: Server, socket: Socket) => {
  socket.on('move task same column', async (data) => {
    try {
      const taskProject = await Task.findOne({ project: data.projectId });

      if (taskProject) {
        //Update column with new task order
        taskProject.set(`columns.${data.newColumn.id}`, {});
        taskProject.set(`columns.${data.newColumn.id}`, data.newColumn);

        const updateTaskProject = await taskProject.save();
        io.to(data.projectId).emit('task update', updateTaskProject);
      }
    } catch (err) {
      console.error(err.message);
    }
  });

  socket.on('move task another column', async (data) => {
    try {
      const taskProject = await Task.findOne({ project: data.projectId });

      if (taskProject) {
        //Update start/source column with new task order
        taskProject.set(`columns.${data.columnStart.id}`, {});
        taskProject.set(`columns.${data.columnStart.id}`, data.columnStart);
        //Update finish/destination column with new task order
        taskProject.set(`columns.${data.columnFinish.id}`, {});
        taskProject.set(`columns.${data.columnFinish.id}`, data.columnFinish);

        const updateTaskProject = await taskProject.save();
        io.to(data.projectId).emit('task update', updateTaskProject);
      }
    } catch (err) {
      console.error(err.message);
    }
  });
};
