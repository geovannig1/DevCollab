import { Socket } from 'socket.io';

export default (socket: Socket) => {
  socket.on('send audio', (data) => {
    try {
      socket.broadcast.emit('user audio', data);
    } catch (err) {
      console.error(err);
    }
  });
};
