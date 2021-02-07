import express from 'express';
const router = express.Router();

import auth from '../../middlewares/auth';
import { getTasks, getTask } from '../../controllers/task';

/**
 *  @route GET api/projects/:projectId/tasks
 *  @desc load the project tasks
 *  @access Private
 */
router.get('/:projectId/tasks', auth, getTasks);

/**
 *  @route GET api/projects/:projectId/tasks/:taskId
 *  @desc load the project task
 *  @access Private
 */
router.get('/:projectId/tasks/:taskId', auth, getTask);

export default router;
