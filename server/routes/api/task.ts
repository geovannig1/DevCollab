import express from 'express';
const router = express.Router();

import auth from '../../middlewares/auth';
import { getTasks, getTask } from '../../controllers/task';
import checkObjectId from '../../middlewares/checkObjectId';

/**
 *  @route GET api/projects/:projectId/tasks
 *  @desc load the project tasks
 *  @access Private
 */
router.get('/:projectId/tasks', auth, checkObjectId('projectId'), getTasks);

/**
 *  @route GET api/projects/:projectId/tasks/:taskId
 *  @desc load a task
 *  @access Private
 */
router.get(
  '/:projectId/tasks/:taskId',
  checkObjectId('projectId'),
  auth,
  getTask
);

export default router;
