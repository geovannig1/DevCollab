import { Server, Socket } from 'socket.io';
import randomstring from 'randomstring';

import Task from '../../models/Task';

export default (io: Server, socket: Socket) => {
  socket.on('create list', async (data) => {
    try {
      const taskProject = await Task.findOne({ project: data.projectId });
      const columnId = randomstring.generate();

      if (taskProject) {
        taskProject.set(`columns.${columnId}`, {
          id: columnId,
          title: data.listData,
          taskIds: [],
        });
        //Add column id to column order
        taskProject.columnOrder?.push(columnId);

        const updatedTaskProject = await taskProject.save();

        //Send the data to client
        io.to(data.projectId).emit('task update', updatedTaskProject);
        return;
      } else if (!taskProject) {
        const columnId = randomstring.generate();

        const newTaskProject = await Task.create({
          project: data.projectId,
          columns: {},
        });

        newTaskProject.set(`columns.${columnId}`, {
          id: columnId,
          title: data.listData,
          taskIds: [],
        });
        newTaskProject.columnOrder?.push(columnId);

        const updatedTaskProject = await newTaskProject.save();

        //Send the data to client
        io.to(data.projectId).emit('task update', updatedTaskProject);
      }
    } catch (err) {
      console.error(err.message);
    }
  });
};
