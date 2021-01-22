import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';

import User, { IUser } from '../models/User';
import jwt from '../services/jwt';

//Google OAuth callback
export const googleCallback = (req: Request, res: Response) => {
  try {
    const token = jwt(<IUser>req.user);

    res
      .cookie('access_token', token, { maxAge: 24 * 60 * 60 * 1000 })
      .redirect('/project');
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

//Register new user to the app
export const register = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email, password, confirmPassword } = req.body;

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
    });

    //Generate jwt token
    const token = jwt(user);

    res
      .status(201)
      .cookie('access_token', token, { maxAge: 24 * 60 * 60 * 1000 })
      .json({ msg: 'User Registered' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
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
      .cookie('access_token', token, { maxAge: 24 * 60 * 60 * 1000 })
      .json({ msg: 'User Authenticated' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
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
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
