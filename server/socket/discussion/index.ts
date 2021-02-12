import { Server, Socket } from 'socket.io';

import comments from './comments';

export default (io: Server, socket: Socket) => {
  comments(io, socket);
};
