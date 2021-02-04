import { Socket } from 'socket.io';

export default (socket: Socket) => {
  socket.on('join project', (data) => {
    socket.join(data.projectId);
  });
};
