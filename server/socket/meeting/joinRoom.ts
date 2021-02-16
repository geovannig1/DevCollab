import { Socket } from 'socket.io';

export default (socket: Socket) => {
  socket.on('join room', (data) => {});

  socket.on('leave room', (data) => {
    socket.leave(data.meetingId);
  });
};
