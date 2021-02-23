import { Socket } from 'socket.io';

export default (socket: Socket) => {
  socket.on('sending signal screen', (data) => {
    try {
      socket.to(data.userToSignal).emit('receive signal screen', {
        signal: data.signal,
        callerId: data.callerId,
      });
    } catch (err) {
      console.error(err.message);
    }
  });

  socket.on('returning screen signal', (data) => {
    try {
      socket.to(data.callerId).emit('receiving returned screen signal', {
        signal: data.signal,
        id: data.userId,
      });
    } catch (err) {
      console.error(err.message);
    }
  });

  socket.on('end share screen', (data) => {
    try {
      socket.to(data.peerId).emit('share screen ended');
    } catch (err) {
      console.error(err.message);
    }
  });
};
