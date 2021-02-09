import { Server, Socket } from 'socket.io';

import Task from '../../models/Task';

export default (io: Server, socket: Socket) => {
  socket.on('delete list', async (data) => {
    try {
      const taskProject = await Task.findOne({ project: data.projectId });

      if (taskProject) {
        // Remove from columns
        taskProject.set(`columns.${data.columnId}`, undefined);

        //Remove from column order
        const newColumnOrder = taskProject.columnOrder?.filter(
          (columnId) => columnId !== data.columnId
        );
        taskProject.columnOrder = newColumnOrder;

        //Remove task from tasks
        const taskIds = data.tasks.map((task: any) => task.id);
        taskIds.forEach((taskId: any) => {
          taskProject.set(`tasks.${taskId}`, undefined);
        });

        const updatedProject = await (await taskProject.save())
          .populate({
            path: 'tasks.$*.comments.user',
            select: ['email', 'avatar'],
          })
          .populate({
            path: 'tasks.$*.members.user',
            select: ['email', 'avatar'],
          })
          .execPopulate();

        io.in(data.projectId).emit('update delete list', updatedProject);
      }
    } catch (err) {
      console.error(err.message);
    }
  });
};
