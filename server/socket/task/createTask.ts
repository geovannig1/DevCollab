import { Server, Socket } from 'socket.io';

import Task from '../../models/Task';

export default (io: Server, socket: Socket) => {
  socket.on('create task', async (data) => {});
};
