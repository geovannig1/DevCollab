import { Server, Socket } from 'socket.io';

import joinRoom from './joinRoom';

export default (io: Server, socket: Socket) => {
  joinRoom(socket);
};
