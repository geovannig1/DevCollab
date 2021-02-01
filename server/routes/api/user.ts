import express from 'express';
const router = express.Router();
import { check } from 'express-validator';

import auth from '../../middlewares/auth';
import { getUser, editUser, deleteUser } from '../../controllers/user';
import validateInput from '../../middlewares/validateInput';
import upload from '../../middlewares/upload';

/**
 *  @route GET api/user
 *  @desc load signed in user data
 *  @access Private
 */
router.get('/', auth, getUser);

/**
 *  @route PATCH api/user
 *  @desc Change user data
 *  @access Private
 */
router.patch(
  '/',
  auth,
  upload.single('avatar'),
  [
    check('firstName', "First name can't be empty").notEmpty(),
    check('lastName', "Last name can't be empty").notEmpty(),
    check('email', "Email can't be empty").notEmpty(),
  ],
  validateInput,
  editUser
);

/**
 *  @route DELETE api/user
 *  @desc Delete  user data
 *  @access Private
 */
router.delete('/', auth, deleteUser);

export default router;
