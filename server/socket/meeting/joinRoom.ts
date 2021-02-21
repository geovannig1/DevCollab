import { Socket } from 'socket.io';

import Meeting from '../../models/Meeting';

interface SocketToRoom {
  [name: string]: { meetingId: string; userId: string } | undefined;
}

//Store the socket id with the room id and user id
const socketToRoom: SocketToRoom = {};

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

        meeting?.set(`usersInRoom.${data.meetingId}`, [
          ...exceptUser,
          data.userId,
        ]);
      } else {
        meeting?.set(`usersInRoom.${data.meetingId}`, [data.userId]);
      }

      await meeting?.save();

      socketToRoom[socket.id] = {
        meetingId: data.meetingId,
        userId: data.userId,
      };

      const otherUserInThisRoom = meeting
        ?.get(`usersInRoom.${data.meetingId}`)
        .filter((id: string) => id !== data.userId);

      socket.emit('all users', otherUserInThisRoom);
    } catch (err) {
      console.error(err.message);
    }
  });

  socket.on('disconnect', async () => {
    try {
      const foundSocket = socketToRoom[socket.id];
      const meeting = await Meeting.findById(foundSocket?.meetingId);

      let room = meeting?.get(`usersInRoom.${foundSocket?.meetingId}`);
      if (room) {
        room = room.filter((id: string) => id !== foundSocket?.userId);

        meeting?.set(`usersInRoom.${foundSocket?.meetingId}`, room);

        meeting?.save();
        socketToRoom[socket.id] = undefined;
      }

      socket.broadcast.emit('user left', foundSocket?.userId);
    } catch (err) {
      console.error(err.message);
    }
  });
};
