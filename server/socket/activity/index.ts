import { Server, Socket } from 'socket.io';

import message from './message';

export default (io: Server, socket: Socket) => {
  message(io, socket);
};
