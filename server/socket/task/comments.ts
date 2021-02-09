import { Server, Socket } from 'socket.io';

import Task from '../../models/Task';

export default (io: Server, socket: Socket) => {
  socket.on('send comment', async (data) => {
    try {
      const taskProject = await Task.findOne({ project: data.projectId });
      if (taskProject) {
        const comment = { user: data.userId, comment: data.commentData };
        const task = taskProject.get(`tasks.${data.taskId}`);
        task.comments.push(comment);

        taskProject.set(`tasks.${data.taskId}`, {});
        taskProject.set(`tasks.${data.taskId}`, task);

        const updatedTaskProject = await (await taskProject.save())
          .populate({
            path: 'tasks.$*.comments.user',
            select: ['email', 'avatar'],
          })
          .populate({
            path: 'tasks.$*.members.user',
            select: ['email', 'avatar'],
          })
          .execPopulate();

        const selectedTask = updatedTaskProject.get(`tasks.${data.taskId}`);

        io.in(data.projectId).emit('receive comment', selectedTask);
      }
    } catch (err) {
      console.error(err.message);
    }
  });

  socket.on('delete comment', async (data) => {
    try {
      const taskProject = await Task.findOne({ project: data.projectId });

      if (taskProject) {
        const task = taskProject.get(`tasks.${data.taskId}`);
        const updatedTask = task.comments.filter(
          (comment: any) => comment._id.toString() !== data.commentId
        );
        task.comments = updatedTask;

        taskProject.set(`tasks.${data.taskId}`, {});
        taskProject.set(`tasks.${data.taskId}`, task);

        const updatedTaskProject = await (await taskProject.save())
          .populate({
            path: 'tasks.$*.comments.user',
            select: ['email', 'avatar'],
          })
          .populate({
            path: 'tasks.$*.members.user',
            select: ['email', 'avatar'],
          })
          .execPopulate();

        const selectedTask = updatedTaskProject.get(`tasks.${data.taskId}`);

        io.in(data.projectId).emit('updated delete comment', selectedTask);
      }
    } catch (err) {
      console.error(err.message);
    }
  });
};
