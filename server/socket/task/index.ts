import { Server, Socket } from 'socket.io';

import createList from './createList';
import createTask from './createTask';
import deleteList from './deleteList';
import moveColumn from './moveColumn';
import moveTask from './moveTask';
import updateList from './updateList';

export default (io: Server, socket: Socket) => {
  createTask(io, socket);
  createList(io, socket);
  moveColumn(socket);
  moveTask(socket);
  deleteList(io, socket);
  updateList(io, socket);
};
