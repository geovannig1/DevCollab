import express from 'express';
const router = express.Router();
import { check } from 'express-validator';

import auth from '../../middlewares/auth';
import validateInput from '../../middlewares/validateInput';
import Upload from '../../middlewares/upload';
import {
  createDiscussion,
  getDiscussions,
  getDiscussion,
} from '../../controllers/discussion';
import checkObjectId from '../../middlewares/checkObjectId';

/**
 *  @route GET api/projects/:projectId/discussions
 *  @desc Load project discussions
 *  @access Private
 */
router.get(
  '/:projectId/discussions',
  auth,
  checkObjectId('projectId'),
  getDiscussions
);

/**
 *  @route GET api/projects/:projectId/discussions/:discussionId
 *  @desc Load a discussion
 *  @access Private
 */
router.get(
  '/:projectId/discussions/:discussionId',
  auth,
  [checkObjectId('projectId'), checkObjectId('discussionId')],
  getDiscussion
);

/**
 *  @route POST api/projects/:projectId/discussions
 *  @desc Create a new discussion
 *  @access Private
 */
router.post(
  '/:projectId/discussions',
  auth,
  check('projectId'),
  Upload.single('attachment'),
  check('title', "Title can't be empty").notEmpty(),
  validateInput,
  createDiscussion
);

export default router;
