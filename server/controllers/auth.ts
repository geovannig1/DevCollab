import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';

import User, { IUser } from '../models/User';

//Google OAuth callback
export const googleCallback = (req: Request, res: Response) => {
  try {
    const payload = {
      user: {
        id: (<IUser>req.user).id,
      },
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET!, {
      expiresIn: '24h',
    });
    res
      .cookie('access_token', token, { maxAge: 24 * 60 * 60 * 1000 })
      .redirect('/');
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

//Register new user to the app
export const register = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    let { firstName, lastName, email, password, confirmPassword } = req.body;

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

    const salt = await bcrypt.genSalt(10);
    password = await bcrypt.hash(password, salt);

    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
    });

    const payload = {
      user: {
        id: user.id,
      },
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET!, {
      expiresIn: '24h',
    });

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
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    const user: IUser = await User.findOne({ email });

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

    const payload = {
      user: {
        id: user.id,
      },
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET!, {
      expiresIn: '24h',
    });

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
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
