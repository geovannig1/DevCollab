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

      const userExist = meeting?.usersInRoom?.find((id) => id === data.userId);

      if (!userExist) {
        meeting?.usersInRoom?.push(data.userId);
      }

      await meeting?.save();

      socketToRoom[socket.id] = {
        meetingId: data.meetingId,
        userId: data.userId,
      };

      const otherUserInThisRoom = meeting?.usersInRoom?.filter(
        (id: string) => id !== data.userId
      );

      socket.emit('all users', otherUserInThisRoom);
    } catch (err) {
      console.error(err.message);
    }
  });

  socket.on('disconnect', async () => {
    try {
      const foundSocket = socketToRoom[socket.id];
      const meeting = await Meeting.findById(foundSocket?.meetingId);

      if (meeting) {
        const updatedMeetng = meeting?.usersInRoom?.filter(
          (id: string) => id !== foundSocket?.userId
        );

        meeting.usersInRoom = updatedMeetng;

        meeting?.save();
        socketToRoom[socket.id] = undefined;
      }

      socket.broadcast.emit('user left', foundSocket?.userId);
    } catch (err) {
      console.error(err.message);
    }
  });
};
