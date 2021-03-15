import express from 'express';
const router = express.Router();

import auth from '../../middlewares/auth';
import checkObjectId from '../../middlewares/checkObjectId';
import { getActivity, removeNotification } from '../../controllers/activity';

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

/**
 *  @route PATCH api/projects/:projectId/activities/notification
 *  @desc Remove user activity notification
 *  @access Private
 */
router.patch(
  '/:projectId/activities/notification',
  auth,
  checkObjectId('projectId'),
  removeNotification
);

export default router;
