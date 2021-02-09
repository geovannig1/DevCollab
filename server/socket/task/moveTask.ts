import { Socket } from 'socket.io';

import Task from '../../models/Task';

export default (socket: Socket) => {
  socket.on('move task same column', async (data) => {
    try {
      const taskProject = await Task.findOne({ project: data.projectId });

      if (taskProject) {
        //Update column with new task order
        taskProject.set(`columns.${data.newColumn.id}`, data.newColumn);

        const updateTaskProject = await (await taskProject.save())
          .populate({
            path: 'tasks.$*.comments.user',
            select: ['email', 'avatar'],
          })
          .populate({
            path: 'tasks.$*.members.user',
            select: ['email', 'avatar'],
          })
          .execPopulate();

        socket
          .to(data.projectId)
          .emit('move task same column update', updateTaskProject);
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
        taskProject.set(`columns.${data.columnStart.id}`, data.columnStart);
        //Update finish/destination column with new task order
        taskProject.set(`columns.${data.columnFinish.id}`, data.columnFinish);

        const updateTaskProject = await (await taskProject.save())
          .populate({
            path: 'tasks.$*.comments.user',
            select: ['email', 'avatar'],
          })
          .populate({
            path: 'tasks.$*.members.user',
            select: ['email', 'avatar'],
          })
          .execPopulate();

        socket
          .to(data.projectId)
          .emit('move task another column update', updateTaskProject);
      }
    } catch (err) {
      console.error(err.message);
    }
  });
};
