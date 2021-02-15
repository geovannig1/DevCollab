import express from 'express';
import { createRoom } from '../../controllers/meeting';
const router = express.Router();
import { check } from 'express-validator';

import auth from '../../middlewares/auth';
import validateInput from '../../middlewares/validateInput';

/**
 *  @route POST api/projects/:projectId/meetings
 *  @desc Create a new meeting room
 *  @access Private
 */
router.post(
  '/:projectId/meetings',
  auth,
  check('name', "Room name can't be empty").notEmpty(),
  validateInput,
  createRoom
);

export default router;
