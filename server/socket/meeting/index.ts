import { Server, Socket } from 'socket.io';

import joinRoom from './joinRoom';
import returningSignal from './returningSignal';
import sendingSignal from './sendingSignal';
import audio from './audio';

export default (io: Server, socket: Socket) => {
  joinRoom(socket);
  sendingSignal(io, socket);
  returningSignal(io, socket);
  audio(socket);
};
