import { Socket } from 'socket.io';

export default (socket: Socket) => {
  socket.on('returning signal', (data) => {
    try {
      socket.to(data.callerId).emit('receiving returned signal', {
        signal: data.signal,
        id: data.userId,
      });
    } catch (err) {
      console.error(err);
    }
  });
};
