import { Server, Socket } from 'socket.io';

import Task from '../../models/Task';

export default (io: Server, socket: Socket) => {
  socket.on('delete task', async (data) => {
    try {
      const taskProject = await Task.findOne({ project: data.projectId });

      if (taskProject) {
        taskProject.set(`tasks.${data.taskId}`, undefined);

        const columns = taskProject.get(`columns.${data.columnId}`);
        const newTaskIds = columns.taskIds.filter(
          (taskId: any) => taskId !== data.taskId
        );

        taskProject.set(`columns.${data.columnId}`, {
          id: data.columnId,
          title: data.taskTitle,
          taskIds: newTaskIds,
        });

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

        io.in(data.projectId).emit('updated delete task', updatedTaskProject);
      }
    } catch (err) {
      console.error(err.message);
    }
  });
};
