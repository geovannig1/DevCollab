import { Server, Socket } from 'socket.io';

import Task, { ITask } from '../../models/Task';

export default (io: Server, socket: Socket) => {
  socket.on('create list', async (data) => {
    try {
      const taskProject = await Task.findOne({ project: data.projectId });

      if (taskProject) {
        taskProject.set(`columns.${data.listData}`, {
          title: data.listData,
          taskIds: [],
        });

        const updatedTaskProject = await taskProject.save();

        //Send the data to client
        io.in(data.projectId).emit('new list', updatedTaskProject);
        return;
      } else if (!taskProject) {
        const newTaskProject = await Task.create({
          project: data.projectId,
          columns: {},
        });

        newTaskProject.set(`columns.${data.listData}`, {
          title: data.listData,
          taskIds: [],
        });

        const updatedTaskProject = await newTaskProject.save();

        //Send the data to client
        io.in(data.projectId).emit('new list', updatedTaskProject);
      }
    } catch (err) {
      console.error(err.message);
    }
  });
};
