import { Server, Socket } from 'socket.io';

import { emitter } from '../../services/eventEmitter';

export default (io: Server, socket: Socket) => {
  socket.on('listen pull', (data) => {
    emitter.on('pullEvent', (pullData) => {
      //Check repoId and node_id from github webhook to ensure the data delivered to correct user
      if (data.repoId === pullData.nodeId) {
        io.in(data.repoId).emit('receive pull', pullData);
      } else {
        return;
      }
    });
  });
};
