import express from 'express';
const router = express.Router();
import { check } from 'express-validator';

import auth from '../../middlewares/auth';
import validateInput from '../../middlewares/validateInput';
import Upload from '../../middlewares/upload';
import { createDiscussion } from '../../controllers/discussion';

/**
 *  @route POST api/projects/:projectId/discussions
 *  @desc Create a new discussion
 *  @access Private
 */
router.post(
  '/:projectId/discussions',
  auth,
  Upload.single('attachment'),
  check('title', "Title can't be empty").notEmpty(),
  validateInput,
  createDiscussion
);

export default router;
