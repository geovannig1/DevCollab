import { Server, Socket } from 'socket.io';

import { emitter } from '../../services/eventEmitter';

export default (io: Server, socket: Socket) => {
  socket.on('listen commit', (data) => {
    emitter.on('commitEvent', (commitData) => {
      //Check repoId and node_id from github webhook to ensure the data deliver to correct user
      if (data.repoId === commitData.nodeId) {
        io.in(data.repoId).emit('receive commit', commitData);
      }
    });
  });
};
