import { Server, Socket } from 'socket.io';

import Activity, { Avatar } from '../../models/Activity';
import Task from '../../models/Task';

export default (io: Server, socket: Socket) => {
  // --Handle task activity--

  socket.on('create activity task', async (data) => {
    try {
      const activity = await Activity.findOne({
        project: data.projectId,
      }).populate('messages.user', ['firstName', 'lastName', 'avatar']);

      //Find the column task
      const taskProject = await Task.findOne({ project: data.projectId });
      const column = taskProject?.get(`columns.${data.columnId}`);

      if (activity) {
        activity.messages.push({
          avatar: Avatar.task,
          name: 'Task',
          message: `${data.userName} added ${data.taskName} task to ${column.title} list`,
        });

        await activity.save();
        io.in(data.projectId).emit('receive activity message', activity);
      }
    } catch (err) {
      console.error(err);
    }
  });

  socket.on('update activity task', async (data) => {
    try {
      const activity = await Activity.findOne({
        project: data.projectId,
      }).populate('messages.user', ['firstName', 'lastName', 'avatar']);

      if (activity) {
        activity.messages.push({
          avatar: Avatar.task,
          name: 'Task',
          message: `${data.userName} updated ${data.taskName} task`,
        });

        await activity.save();
        io.in(data.projectId).emit('receive activity message', activity);
      }
    } catch (err) {
      console.error(err);
    }
  });

  socket.on('delete activity task', async (data) => {
    try {
      const activity = await Activity.findOne({
        project: data.projectId,
      }).populate('messages.user', ['firstName', 'lastName', 'avatar']);

      if (activity) {
        activity.messages.push({
          avatar: Avatar.task,
          name: 'Task',
          message: `${data.userName} deleted ${data.taskName} task`,
        });

        await activity.save();
        io.in(data.projectId).emit('receive activity message', activity);
      }
    } catch (err) {
      console.error(err);
    }
  });

  socket.on('move activity task', async (data) => {
    try {
      const activity = await Activity.findOne({
        project: data.projectId,
      }).populate('messages.user', ['firstName', 'lastName', 'avatar']);

      //Find task
      const taskProject = await Task.findOne({ project: data.projectId });
      const task = taskProject?.get(`tasks.${data.taskId}`);

      if (activity) {
        activity.messages.push({
          avatar: Avatar.task,
          name: 'Task',
          message: `${data.userName} moved ${task.title} task from ${data.sourceListName} list
           to ${data.destionationListName} list`,
        });

        await activity.save();
        io.in(data.projectId).emit('receive activity message', activity);
      }
    } catch (err) {
      console.error(err);
    }
  });

  // --Handle list activity--

  socket.on('create activity list', async (data) => {
    try {
      const activity = await Activity.findOne({
        project: data.projectId,
      }).populate('messages.user', ['firstName', 'lastName', 'avatar']);

      if (activity) {
        activity.messages.push({
          avatar: Avatar.task,
          name: 'Task',
          message: `${data.userName} added ${data.listName} list`,
        });

        await activity.save();
        io.in(data.projectId).emit('receive activity message', activity);
      }
    } catch (err) {
      console.error(err);
    }
  });

  socket.on('update activity list', async (data) => {
    try {
      const activity = await Activity.findOne({
        project: data.projectId,
      }).populate('messages.user', ['firstName', 'lastName', 'avatar']);

      if (activity) {
        activity.messages.push({
          avatar: Avatar.task,
          name: 'Task',
          message: `${data.userName} renamed ${data.previousListName} list to ${data.listName}`,
        });

        await activity.save();
        io.in(data.projectId).emit('receive activity message', activity);
      }
    } catch (err) {
      console.error(err);
    }
  });

  socket.on('delete activity list', async (data) => {
    try {
      const activity = await Activity.findOne({
        project: data.projectId,
      }).populate('messages.user', ['firstName', 'lastName', 'avatar']);

      if (activity) {
        activity.messages.push({
          avatar: Avatar.task,
          name: 'Task',
          message: `${data.userName} deleted ${data.listName} list`,
        });

        await activity.save();
        io.in(data.projectId).emit('receive activity message', activity);
      }
    } catch (err) {
      console.error(err);
    }
  });
};
