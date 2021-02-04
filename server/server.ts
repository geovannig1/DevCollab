import { createServer } from 'http';
import express from 'express';
import cookieParser from 'cookie-parser';
import path from 'path';
import connectDB from './config/db';
import { Server, Socket } from 'socket.io';
import dotenv from 'dotenv';
dotenv.config({ path: path.join(__dirname, 'config', '.env') });

import joinProject from './socket/joinProject';
import createTask from './socket/task/createTask';
import createList from './socket/task/createList';

import auth from './routes/api/auth';
import user from './routes/api/user';
import project from './routes/api/project';

const app = express();

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:3000',
  },
});

//Connect Database
connectDB();

app.use(express.json());
app.use(cookieParser());

//Define Socketio
io.on('connection', (socket: Socket) => {
  joinProject(socket);
  createTask(io, socket);
  createList(io, socket);
});

//Define Routes
app.use('/api/auth', auth);
app.use('/api/user', user);
app.use('/api/projects', project);

const PORT = process.env.PORT ?? '5000';
httpServer.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
