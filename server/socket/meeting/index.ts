import { Socket } from 'socket.io';

import joinRoom from './joinRoom';
import returningSignal from './returningSignal';
import sendingSignal from './sendingSignal';
import audio from './audio';
import shareScreen from './shareScreen';

export default (socket: Socket) => {
  joinRoom(socket);
  sendingSignal(socket);
  returningSignal(socket);
  audio(socket);
  shareScreen(socket);
};
