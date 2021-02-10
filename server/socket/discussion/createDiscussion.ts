import { Server, Socket } from 'socket.io';

import Discussion from '../../models/Discussion';

export default (io: Server, socket: Socket) => {
  socket.on('create discussion', async (data) => {
    try {
    } catch (err) {
      console.error(err.message);
    }
  });
};
