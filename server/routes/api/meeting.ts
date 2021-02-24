import express from 'express';
const router = express.Router();
import { check } from 'express-validator';

import auth from '../../middlewares/auth';
import validateInput from '../../middlewares/validateInput';
import {
  createRoom,
  deleteRoom,
  getRoom,
  getRooms,
  updateRoom,
} from '../../controllers/meeting';
import checkObjectId from '../../middlewares/checkObjectId';

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
router.get(
  '/:projectId/meetings/:meetingId',
  auth,
  [checkObjectId('projectId'), checkObjectId('meetingId')],
  getRoom
);

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
  checkObjectId('projectId'),
  validateInput,
  createRoom
);

/**
 *  @route PATCH api/projects/:projectId/meetings/:meetingId
 *  @desc Update a meeting room
 *  @access Private
 */
router.patch(
  '/:projectId/meetings/:meetingId',
  auth,
  [
    check('name', "Room name can't be empty").notEmpty(),
    check('members', 'Please include invited member').notEmpty(),
  ],
  [checkObjectId('projectId'), checkObjectId('meetingId')],
  validateInput,
  updateRoom
);

/**
 *  @route DELETE api/projects/:projectId/meetings/:meetingId
 *  @desc Delete a meeting room
 *  @access Private
 */
router.delete(
  '/:projectId/meetings/:meetingId',
  auth,
  [checkObjectId('projectId'), checkObjectId('meetingId')],
  deleteRoom
);

export default router;
