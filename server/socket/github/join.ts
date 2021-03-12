import { Socket } from 'socket.io';

import { emitter } from '../../services/eventEmitter';

export default (socket: Socket) => {
  socket.on('join repo', (data) => {
    socket.join(data.repoId);
  });

  socket.on('leave repo', (data) => {
    socket.leave(data.repoId);
  });

  socket.on('unregister event', () => {
    emitter.removeAllListeners();
  });
};
