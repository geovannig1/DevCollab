import { Server, Socket } from 'socket.io';
import randomstring from 'randomstring';

import Task from '../../models/Task';

export default (io: Server, socket: Socket) => {
  socket.on('create list', async (data) => {
    try {
      const taskProject = await Task.findOne({ project: data.projectId });
      const columnId = randomstring.generate(20);

      if (taskProject) {
        taskProject.set(`columns.${columnId}`, {
          id: columnId,
          title: data.listData,
          taskIds: [],
        });
        //Add column id to column order
        taskProject.columnOrder?.push(columnId);

        const updatedTaskProject = await (await taskProject.save())
          .populate({
            path: 'tasks.$*.comments.user',
            select: ['firstName', 'lastName', 'avatar'],
          })
          .populate({
            path: 'tasks.$*.members.user',
            select: ['email', 'avatar'],
          })
          .execPopulate();
        //Send the data to client
        io.in(data.projectId).emit('new list update', updatedTaskProject);
        return;
      } else if (!taskProject) {
        const columnId = randomstring.generate(20);

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

        const updatedTaskProject = await (await newTaskProject.save())
          .populate({
            path: 'tasks.$*.comments.user',
            select: ['firstName', 'lastName', 'avatar'],
          })
          .populate({
            path: 'tasks.$*.members.user',
            select: ['email', 'avatar'],
          })
          .execPopulate();
        //Send the data to client
        io.in(data.projectId).emit('new list update', updatedTaskProject);
      }
    } catch (err) {
      console.error(err);
    }
  });
};
