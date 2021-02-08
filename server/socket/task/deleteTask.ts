import { Server, Socket } from 'socket.io';

export default (io: Server, socket: Socket) => {
  socket.on('delete task', async (data) => {
    try {
      console.log(data);
    } catch (err) {
      console.error(err.message);
    }
  });
};
