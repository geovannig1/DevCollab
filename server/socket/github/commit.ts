import { Server, Socket } from 'socket.io';

import { emitter } from '../../services/eventEmitter';

export default (io: Server, socket: Socket) => {
  socket.on('listen commit', (data) => {
    emitter.on('commitEvent', async (commitData) => {
      //Check repoId and node_id from github webhook to ensure the data delivered to correct user
      if (data.repoId === commitData.nodeId) {
        io.in(data.repoId).emit('receive commit', commitData);
      } else {
        return;
      }
    });
  });
};
