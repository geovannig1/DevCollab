import { Server, Socket } from 'socket.io';

import Activity from '../../models/Activity';
import Project from '../../models/Project';
import addNotification from '../../services/addNotification';

export default (io: Server, socket: Socket) => {
  socket.on('send activity message', async (data) => {
    try {
      let activity = await Activity.findOne({ project: data.projectId });

      //Find project members except logged in user
      const project = await Project.findById(data.projectId);
      const userProject = project?.members.map((member) => member.user);

      if (activity) {
        activity.messages.push({ user: data.user, message: data.message });
        await (await activity.save())
          .populate({
            path: 'messages.user',
            select: ['firstName', 'lastName', 'avatar'],
          })
          .execPopulate();
      } else {
        //Create new activity when the activity is not exist in the project
        activity = await Activity.create({
          project: data.projectId,
          messages: [{ user: data.user, message: data.message }],
        });
        await activity
          .populate({
            path: 'messages.user',
            select: ['firstName', 'lastName', 'avatar'],
          })
          .execPopulate();
      }

      if (activity) {
        //Add notification
        addNotification(activity, data, userProject);

        await (await activity.save())
          .populate({
            path: 'messages.user',
            select: ['firstName', 'lastName', 'avatar'],
          })
          .execPopulate();
      }

      io.in(data.projectId).emit('receive activity message', activity);
    } catch (err) {
      console.error(err);
    }
  });

  socket.on('delete activity message', async (data) => {
    try {
      const activity = await Activity.findOne({
        project: data.projectId,
      }).populate('messages.user', ['firstName', 'lastName', 'avatar']);

      if (activity) {
        const deletedActivity = activity.messages.filter(
          (message) => message._id?.toString() !== data.messageId
        );

        activity.messages = deletedActivity;
        const updatedActivity = await activity.save();

        io.in(data.projectId).emit('receive activity message', updatedActivity);
      }
    } catch (err) {
      console.error(err);
    }
  });
};
