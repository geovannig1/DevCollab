import express from 'express';
const router = express.Router();
import { check } from 'express-validator';

import auth from '../../middlewares/auth';
import validateInput from '../../middlewares/validateInput';
import { createRoom, getRoom, getRooms } from '../../controllers/meeting';

/**
 *  @route GET api/projects/:projectId/meetings
 *  @desc Load all meetings
 *  @access Private
 */
router.get('/:projectId/meetings', auth, getRooms);

/**
 *  @route GET api/projects/:projectId/meetings/:meetingId
 *  @desc Load a meeting
 *  @access Private
 */
router.get('/:projectId/meetings/:meetingId', auth, getRoom);

/**
 *  @route POST api/projects/:projectId/meetings
 *  @desc Create a new meeting room
 *  @access Private
 */
router.post(
  '/:projectId/meetings',
  auth,
  [
    check('name', "Room name can't be empty").notEmpty(),
    check('members', 'Please include invited member').notEmpty(),
  ],
  validateInput,
  createRoom
);

export default router;
