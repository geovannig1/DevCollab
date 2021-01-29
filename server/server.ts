import express from 'express';
import cookieParser from 'cookie-parser';
import path from 'path';
import connectDB from './config/db';
import dotenv from 'dotenv';
dotenv.config({ path: path.join(__dirname, 'config', '.env') });

import auth from './routes/api/auth';
import user from './routes/api/user';
import project from './routes/api/project';

const app = express();

//Connect Database
connectDB();

app.use(express.json());
app.use(cookieParser());

//Define Routes
app.use('/api/auth', auth);
app.use('/api/user', user);
app.use('/api/projects', project);

const PORT = process.env.PORT ?? '5000';
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
