import express from 'express';
const router = express.Router();
import { check } from 'express-validator';

import passport from '../../services/passportGoogle';
import {
  googleCallback,
  register,
  login,
  logout,
} from '../../controllers/auth';
import auth from '../../middlewares/auth';
import validateInput from '../../middlewares/validateInput';

/**
 *  @route GET api/auth/google
 *  @desc Google OAuth SignIn/SignUp
 *  @access Public
 */
router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    session: false,
  })
);

/**
 *  @route GET api/auth/google/callback
 *  @desc Callback google OAuth
 *  @access Public
 */
router.get(
  '/google/callback',
  passport.authenticate('google', { session: false }),
  googleCallback
);

/**
 *  @route POST api/auth/signup
 *  @desc Register user
 *  @access Public
 */
router.post(
  '/signup',
  [
    check('firstName', 'First name is required').notEmpty(),
    check('lastName', 'Last name is required').notEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check(
      'password',
      'Please enter the password with 8 or more characters'
    ).isLength({ min: 8 }),
    check('confirmPassword', 'Confirm password is required').notEmpty(),
  ],
  validateInput,
  register
);

/**
 *  @route POST api/auth/signin
 *  @desc Login user
 *  @access Public
 */
router.post(
  '/signin',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter the password').notEmpty(),
  ],
  validateInput,
  login
);

/**
 *  @route POST api/auth/signout
 *  @desc logout user
 *  @access Private
 */
router.get('/signout', auth, logout);

export default router;
