import express from 'express';
const router = express.Router();

import auth from '../../middlewares/auth';
import checkObjectId from '../../middlewares/checkObjectId';
import { getActivity } from '../../controllers/activity';

/**
 *  @route GET api/projects/:projectId/activities
 *  @desc Load all activies
 *  @access Private
 */
router.get(
  '/:projectId/activity',
  auth,
  checkObjectId('projectId'),
  getActivity
);

export default router;
