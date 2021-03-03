import { Socket } from 'socket.io';

export default (socket: Socket) => {
  socket.on('sending signal', (data) => {
    try {
      socket.to(data.userToSignal).emit('user joined', {
        signal: data.signal,
        callerId: data.callerId,
      });
    } catch (err) {
      console.error(err);
    }
  });
};
