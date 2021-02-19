import { Socket } from 'socket.io';

import Meeting from '../../models/Meeting';

// interface UsersInRoom {
//   [name: string]: string[];
// }

// interface UserToRoom {
//   [name: string]: string;
// }
// //User data in each rooms
// const usersInRoom: UsersInRoom = {};
// //user and room relation
// const userToRoom: UserToRoom = {};

export default (socket: Socket) => {
  socket.on('join room', async (data) => {
    try {
      socket.join(data.userId);
      const meeting = await Meeting.findById(data.meetingId);
      const meetingRoom = meeting?.get(`usersInRoom.${data.meetingId}`);

      if (meetingRoom) {
        const exceptUser = meetingRoom.filter(
          (id: string) => id !== data.userId
        );
        // usersInRoom[data.meetingId].push(data.userId);
        meeting?.set(`usersInRoom.${data.meetingId}`, [
          ...exceptUser,
          data.userId,
        ]);
      } else {
        meeting?.set(`usersInRoom.${data.meetingId}`, [data.userId]);
      }

      // userToRoom[data.userId] = data.meetingId;
      meeting?.set(`userToRoom.${data.userId}`, data.meetingId);

      //Users in the room except signed in user
      // const otherUserInThisRoom = usersInRoom[data.meetingId].filter(
      //   (id) => id !== data.userId
      // );

      await meeting?.save();

      const otherUserInThisRoom = meeting
        ?.get(`usersInRoom.${data.meetingId}`)
        .filter((id: string) => id !== data.userId);

      socket.emit('all users', otherUserInThisRoom);
    } catch (err) {
      console.error(err.message);
    }
  });

  // socket.on('leave room', (data) => {
  //   socket.leave(data.meetingId);
  // });
};
