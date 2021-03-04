import { Socket } from 'socket.io';

import Task from '../../models/Task';

export default (socket: Socket) => {
  socket.on('update task', async (data) => {
    try {
      const projectTask = await Task.findOne({ project: data.projectId });

      if (projectTask) {
        projectTask.set(`tasks.${data.taskId}`, data.taskData);
        const updatedProjectTask = await projectTask.save();

        const tasks = await updatedProjectTask
          .populate({
            path: 'tasks.$*.comments.user',
            select: ['firstName', 'lastName', 'avatar'],
          })
          .populate({
            path: 'tasks.$*.members.user',
            select: ['email', 'avatar'],
          })
          .execPopulate();

        const selectedTask = tasks.get(`tasks.${data.taskId}`);

        //Send all the tasks data
        socket
          .to(data.projectId)
          .emit('updated update task', updatedProjectTask);

        //Send the selected data only
        socket.to(data.projectId).emit('updated selected task', selectedTask);
      }
    } catch (err) {
      console.error(err);
    }
  });
};
