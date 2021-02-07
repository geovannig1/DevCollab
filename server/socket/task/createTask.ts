import { Server, Socket } from 'socket.io';
import randomstring from 'randomstring';

import Task from '../../models/Task';

export default (io: Server, socket: Socket) => {
  socket.on('create task', async (data) => {
    try {
      const taskProject = await Task.findOne({ project: data.projectId });
      const taskId = randomstring.generate(20);
      const members = data.taskData.members.map((member: any) => ({
        user: member.user._id,
      }));

      if (taskProject) {
        taskProject.set(`tasks.${taskId}`, {
          id: taskId,
          title: data.taskData.title,
          description: data.taskData.description,
          members: members,
          dueDate: data.taskData.dueDate,
        });
        //Add task id to columns
        const columns = taskProject.get(`columns.${data.columnId}`);
        columns.taskIds.push(taskId);
        taskProject.set(`columns.${data.columnId}`, {});
        taskProject.set(`columns.${data.columnId}`, columns);

        const updatedTaskProject = await taskProject.save();
        io.in(data.projectId).emit('new task update', updatedTaskProject);
      }
    } catch (err) {
      console.error(err.message);
    }
  });
};
