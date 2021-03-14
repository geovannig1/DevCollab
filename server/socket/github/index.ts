import { Server, Socket } from 'socket.io';

import join from './join';
import commit from './commit';
import pull from './pull';

export default (io: Server, socket: Socket) => {
  join(socket);
  commit(io, socket);
  pull(io, socket);
};
