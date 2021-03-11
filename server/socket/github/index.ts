import { Server, Socket } from 'socket.io';

import join from './join';
import commit from './commit';

export default (io: Server, socket: Socket) => {
  join(socket);
  commit(io, socket);
};
