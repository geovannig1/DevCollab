import express from 'express';
const router = express.Router();

import auth from '../../middlewares/auth';
import { getTask } from '../../controllers/task';

/**
 *  @route GET api/tasks/:projectId
 *  @desc load the project task
 *  @access Private
 */
router.get('/:projectId', auth, getTask);

export default router;
