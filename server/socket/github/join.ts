import { Socket } from 'socket.io';

export default (socket: Socket) => {
  socket.on('join repo', (data) => {
    socket.join(data.repoId);
  });

  socket.on('leave repo', (data) => {
    socket.leave(data.repoId);
  });
};
