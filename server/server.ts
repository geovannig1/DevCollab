import { createServer } from 'http';
import express, { Request, Response } from 'express';
import cookieParser from 'cookie-parser';
import path from 'path';
import connectDB from './config/db';
import sslRedirect from './middlewares/sslRedirect';
import { Server, Socket } from 'socket.io';
import dotenv from 'dotenv';
if (process.env.NODE_ENV !== 'production') {
  dotenv.config({ path: path.join(__dirname, 'config', '.env') });
}

import auth from './routes/api/auth';
import user from './routes/api/user';
import project from './routes/api/project';
import task from './routes/api/task';
import discussion from './routes/api/discussion';
import meeting from './routes/api/meeting';
import note from './routes/api/note';
import file from './routes/api/file';
import activity from './routes/api/activity';
import github from './routes/api/github';

import joinProject from './socket/joinProject';
import taskSocket from './socket/task';
import discussionSocket from './socket/discussion';
import meetingSocket from './socket/meeting';
import activitySocket from './socket/activity';
import githubSocket from './socket/github';

const app = express();

const httpServer = createServer(app);

//Add cors when in development
const cors: { origin?: string } = {};
if (process.env.NODE_ENV !== 'production') {
  cors.origin = 'http://localhost:3000';
}

const io = new Server(httpServer, {
  cors: cors,
});

//Connect Database
connectDB();

app.use(express.json());
app.use(cookieParser());

//Define Socketio
io.on('connection', (socket: Socket) => {
  joinProject(socket);
  taskSocket(io, socket);
  discussionSocket(io, socket);
  meetingSocket(socket);
  activitySocket(io, socket);
  githubSocket(io, socket);
});

//Heroku Middleware SSL Redirect
if (process.env.NODE_ENV === 'production') {
  app.use(sslRedirect);
}

//Define Routes
app.use('/api/auth', auth);
app.use('/api/user', user);
app.use('/api/projects', project);
app.use('/api/projects', task);
app.use('/api/projects', discussion);
app.use('/api/projects', meeting);
app.use('/api/projects', note);
app.use('/api/projects', file);
app.use('/api/projects', activity);
app.use('/api/projects', github);

//Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  //Set static folder
  app.use(express.static(path.resolve(process.cwd(), 'client', 'build')));

  app.get('*', (req: Request, res: Response) => {
    res.sendFile(path.resolve(process.cwd(), 'client', 'build', 'index.html'));
  });
}

const PORT = process.env.PORT || '5000';
httpServer.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
