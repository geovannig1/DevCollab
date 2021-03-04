import { Server, Socket } from 'socket.io';

import message from './message';
import discussion from './discussion';
import meeting from './meeting';
import note from './note';
import file from './file';
import task from './task';

export default (io: Server, socket: Socket) => {
  message(io, socket);
  discussion(io, socket);
  meeting(io, socket);
  note(io, socket);
  file(io, socket);
  task(io, socket);
};
