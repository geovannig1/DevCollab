import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';

import User from '../models/User';

//Get signed in user data
export const getUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.user)
      .select('-password')
      .select('-date')
      .select('-__v');

    res.status(200).json(user);
    return;
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

//Edit signed in user data
export const editUser = async (req: Request, res: Response) => {
  try {
    const {
      firstName,
      lastName,
      newPassword,
      confirmNewPassowrd,
      currentPassword,
      email,
    } = req.body;

    const user = await User.findById(req.user);

    //Edit user data
    if (user && firstName) user.firstName = firstName;
    if (user && lastName) user.lastName = lastName;
    if (user && email) {
      const users = await User.findOne({ email });
      if (users && email !== user.email) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Email already in use' }] });
      }

      user.email = email;
    }
    if (user && newPassword) {
      //Check if password match
      if (newPassword !== confirmNewPassowrd) {
        return res.status(400).json({ msg: 'Password not match' });
      }

      //Check if the password is correct or not
      let isMatch = false;
      if (user?.password) {
        isMatch = await bcrypt.compare(currentPassword, user.password);
      }

      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Current password invalid' }] });
      }

      user.password = newPassword;
    }

    await user?.save();
    res.status(200).json({ msg: 'User updated' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
