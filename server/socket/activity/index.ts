import { Server, Socket } from 'socket.io';

import message from './message';
import discussion from './discussion';
import meeting from './meeting';

export default (io: Server, socket: Socket) => {
  message(io, socket);
  discussion(io, socket);
  meeting(io, socket);
};
