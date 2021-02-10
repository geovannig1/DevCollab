import { Server, Socket } from 'socket.io';

import createDiscussion from './createDiscussion';

export default (io: Server, socket: Socket) => {
  createDiscussion(io, socket);
};
