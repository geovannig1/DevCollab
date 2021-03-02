import express from 'express';
const router = express.Router();

import auth from '../../middlewares/auth';
import checkObjectId from '../../middlewares/checkObjectId';
import { getActivities } from '../../controllers/activity';

/**
 *  @route GET api/projects/:projectId/activities
 *  @desc Load all activies
 *  @access Private
 */
router.get(
  '/:projectId/activities',
  auth,
  checkObjectId('projectId'),
  getActivities
);

export default router;
