import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import path from 'path';
import connectDB from './config/db';

const app = express();

//Add Environment Variable
dotenv.config({ path: path.join(__dirname, 'config', '.env') });

//Connect Database
connectDB();

app.use(express.json());
app.use(cookieParser());

//Define Routes
import auth from './routes/api/auth';
import user from './routes/api/user';
import project from './routes/api/project';

app.use('/api/auth', auth);
app.use('/api/user', user);
app.use('/api/projects', project);

const PORT = process.env.PORT ?? '5000';
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
