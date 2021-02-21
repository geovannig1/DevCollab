import { Socket } from 'socket.io';

export default (socket: Socket) => {
  socket.on('send audio', (data) => {
    socket.broadcast.emit('user audio', data);
  });
};
