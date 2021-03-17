import { Server, Socket } from 'socket.io';

import Activity, { Avatar } from '../../models/Activity';
import Project from '../../models/Project';
import Task from '../../models/Task';
import addNotification from '../../services/addNotification';

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

      //Find project members except logged in user
      const project = await Project.findById(data.projectId);
      const userProject = project?.members.map((member) => member.user);

      if (activity) {
        //Push new message
        activity.messages.push({
          avatar: Avatar.task,
          name: 'Task',
          message: `**${data.userName.trim()}** added **${data.taskName.trim()}** task to **${column.title.trim()}** list`,
        });

        //Add notification
        addNotification(activity, data, userProject);

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

      //Find project members except logged in user
      const project = await Project.findById(data.projectId);
      const userProject = project?.members.map((member) => member.user);

      if (activity) {
        activity.messages.push({
          avatar: Avatar.task,
          name: 'Task',
          message: `**${data.userName.trim()}** updated **${data.taskName.trim()}** task`,
        });

        //Add notification
        addNotification(activity, data, userProject);

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

      //Find project members except logged in user
      const project = await Project.findById(data.projectId);
      const userProject = project?.members.map((member) => member.user);

      if (activity) {
        activity.messages.push({
          avatar: Avatar.task,
          name: 'Task',
          message: `**${data.userName.trim()}** deleted **${data.taskName.trim()}** task`,
        });

        //Add notification
        addNotification(activity, data, userProject);

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

      //Find project members except logged in user
      const project = await Project.findById(data.projectId);
      const userProject = project?.members.map((member) => member.user);

      if (activity) {
        activity.messages.push({
          avatar: Avatar.task,
          name: 'Task',
          message: `**${data.userName.trim()}** moved **${task.title.trim()}** task from **${data.sourceListName.trim()}** list
           to **${data.destionationListName.trim()}** list`,
        });

        //Add notification
        addNotification(activity, data, userProject);

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

      //Find project members except logged in user
      const project = await Project.findById(data.projectId);
      const userProject = project?.members.map((member) => member.user);

      if (activity) {
        activity.messages.push({
          avatar: Avatar.task,
          name: 'Task',
          message: `**${data.userName.trim()}** added **${data.listName.trim()}** list`,
        });

        //Add notification
        addNotification(activity, data, userProject);

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

      //Find project members except logged in user
      const project = await Project.findById(data.projectId);
      const userProject = project?.members.map((member) => member.user);

      if (activity) {
        activity.messages.push({
          avatar: Avatar.task,
          name: 'Task',
          message: `**${data.userName.trim()}** renamed **${data.previousListName.trim()}** list to **${data.listName.trim()}**`,
        });

        //Add notification
        addNotification(activity, data, userProject);

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

      //Find project members except logged in user
      const project = await Project.findById(data.projectId);
      const userProject = project?.members.map((member) => member.user);

      if (activity) {
        activity.messages.push({
          avatar: Avatar.task,
          name: 'Task',
          message: `**${data.userName.trim()}** deleted **${data.listName.trim()}** list`,
        });

        //Add notification
        addNotification(activity, data, userProject);

        await activity.save();
        io.in(data.projectId).emit('receive activity message', activity);
      }
    } catch (err) {
      console.error(err);
    }
  });
};
