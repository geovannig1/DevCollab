import { Server, Socket } from 'socket.io';

import Discussion from '../../models/Discussion';

export default (io: Server, socket: Socket) => {
  socket.on('send discussion comment', async (data) => {
    try {
      const discussion = await Discussion.findById(data.discussionId);
      if (discussion) {
        discussion.comments?.push({
          user: data.userId,
          comment: data.commentData,
        });
        await (await discussion.save())
          .populate({
            path: 'comments.user',
            select: ['avatar', 'email'],
          })
          .execPopulate();
      }

      io.in(data.projectId).emit('receive discussion comment', discussion);
    } catch (err) {
      console.error(err.message);
    }
  });
};
