import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import axios from 'axios';

import jwt from '../services/jwt';
import User, { IUser } from '../models/User';
import Project from '../models/Project';
import { existAdmin } from '../services/checkPermission';

//Google OAuth callback
export const googleCallback = (req: Request, res: Response) => {
  try {
    const token = jwt(<IUser>req.user);

    res
      .cookie('access_token', token, { maxAge: 3 * 24 * 60 * 60 * 1000 })
      .redirect('/projects');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

//Github OAuth
export const githubOauth = async (req: Request, res: Response) => {
  try {
    const project = await Project.findById(req.params.projectId);

    if (!project) {
      return res.status(404).json({ msg: 'Project not found' });
    }
    //Only user from the project and user with admin access permission can access the oauth
    const permission = existAdmin(project, req.user);
    if (!permission) {
      return res.status(401).json({ msg: 'Unauthorized user' });
    }

    //Store the projectId as a cookie and redirect to the github login
    res
      .cookie('project_id', req.params.projectId)
      .redirect(
        `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&redirect_uri=https://github.com/apps/devcollabapp`
      );
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

//Execute callback when redirect from the github app
export const githubRedirectCallback = async (req: Request, res: Response) => {
  try {
    res.redirect(
      `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}`
    );
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

//Github OAuth callback
export const githubCallback = async (req: Request, res: Response) => {
  try {
    // The req.query object has the query params that were sent to this route.
    const requestToken = req.query.code;

    const body = {
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      code: requestToken,
    };
    const opts = { headers: { accept: 'application/json' } };

    const response = await axios.post(
      'https://github.com/login/oauth/access_token',
      body,
      opts
    );

    const access_token = response.data.access_token;

    //Get the projectId from the cookie
    const projectId = req.cookies['project_id'];

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ msg: 'Project not found' });
    }

    if (access_token) project.githubAccessToken = access_token;
    await project.save();

    res
      .status(200)
      .clearCookie('project_id')
      .redirect(`/projects/${projectId}/github-connection`);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

//Register new user to the app
export const register = async (req: Request, res: Response) => {
  try {
    let { firstName, lastName, email, password, confirmPassword } = req.body;

    //Remove white space
    firstName = firstName.trim();
    lastName = lastName.trim();
    email = email.trim();

    //Check if the password not match
    if (password !== confirmPassword) {
      return res.status(400).json({ errors: [{ msg: 'Password not match' }] });
    }

    //Check if the email is used in another account
    const userExist = await User.findOne({ email });
    if (userExist) {
      return res
        .status(400)
        .json({ errors: [{ msg: 'Email already in use' }] });
    }

    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
      havePassword: true,
    });

    //Generate jwt token
    const token = jwt(user);

    res
      .status(201)
      .cookie('access_token', token, { maxAge: 3 * 24 * 60 * 60 * 1000 })
      .json({ msg: 'User Registered' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

//User login
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    //Check if user not exist
    if (!user) {
      return res.status(400).json({ errors: [{ msg: 'Invalid Credentials' }] });
    }

    //Check if password not exist
    if (!user.password) {
      return res.status(400).json({ errors: [{ msg: 'Invalid Credentials' }] });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ errors: [{ msg: 'Invalid Credentials' }] });
    }

    //Generate jwt token
    const token = jwt(user);

    res
      .status(200)
      .cookie('access_token', token, { maxAge: 3 * 24 * 60 * 60 * 1000 })
      .json({ msg: 'User Authenticated' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

//User logout
export const logout = (req: Request, res: Response) => {
  try {
    res
      .status(200)
      .clearCookie('access_token')
      .json({ msg: 'User signed out' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};
