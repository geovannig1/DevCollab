import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import fs from 'fs';

import User from '../models/User';
import cloudinary from '../config/cloudinaryConfig';
import Project from '../models/Project';

//Get signed in user data
export const getUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.user)
      .select('-password')
      .select('-date')
      .select('-__v');

    res.status(200).json(user);
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
      currentPassword,
      newPassword,
      confirmNewPassowrd,
      email,
    } = req.body;

    if (newPassword && newPassword.length < 8) {
      return res.status(400).json({
        errors: [
          { msg: 'Please enter the new password with 8 or more characters' },
        ],
      });
    }

    const user = await User.findById(req.user);

    if (!user) {
      return res.status(404).json({ errors: [{ msg: 'User not found' }] });
    }

    //Edit user data
    if (firstName) user.firstName = firstName.trim();
    if (lastName) user.lastName = lastName.trim();
    if (email) {
      const users = await User.findOne({ email });
      if (users && email !== user.email) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Email already in use' }] });
      }

      user.email = email;
    }

    //Add avatar
    if (req.file) {
      cloudinary.uploader.upload(req.file.path, async (err, result) => {
        user.avatar = result?.secure_url;
        await user.save();

        //Delete image in the upload folder
        fs.unlink(req.file.path, (err) => {
          if (err) {
            console.error(err);
            return;
          }
          //file removed
        });
      });
    }

    if (newPassword) {
      //Check if password match
      if (newPassword !== confirmNewPassowrd) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Password not match' }] });
      }

      //Check if the password is correct or not
      if (user.havePassword) {
        let isMatch = false;
        if (user.password) {
          isMatch = await bcrypt.compare(currentPassword, user.password);
        }

        if (!isMatch) {
          return res
            .status(400)
            .json({ errors: [{ msg: 'Current password invalid' }] });
        }
      }

      user.password = newPassword;
      user.havePassword = true;
    }

    await user.save();
    const updatedUser = await User.findById(req.user)
      .select('-password')
      .select('-date')
      .select('-__v');

    res.status(200).json(updatedUser);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

//Delete user
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.user);
    const projects = await Project.find({
      members: { $elemMatch: { user: req.user } },
    });

    //Delete user from member
    for (const project of projects) {
      const updatedProject = project.members.filter(
        (member) => member.user?.toString() !== req.user
      );
      project.members = updatedProject;
      await project.save();
    }

    await user?.remove();
    res.status(200).clearCookie('access_token').json({ msg: 'User deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
