import express from 'express';
const router = express.Router();
import { check } from 'express-validator';

import auth from '../../middlewares/auth';
import validateInput from '../../middlewares/validateInput';
import upload from '../../middlewares/upload';
import {
  createDiscussion,
  getDiscussions,
  getDiscussion,
  updateDiscussion,
  deleteDiscussion,
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
  upload.single('attachment'),
  check('title', "Title can't be empty").notEmpty(),
  validateInput,
  createDiscussion
);

/**
 *  @route POST api/projects/:projectId/discussions/:discussionId
 *  @desc Update a discussion
 *  @access Private
 */
router.patch(
  '/:projectId/discussions/:discussionId',
  auth,
  [checkObjectId('projectId'), checkObjectId('discussionId')],
  upload.single('attachment'),
  check('title', "Title can't be empty").notEmpty(),
  validateInput,
  updateDiscussion
);

/**
 *  @route DELETE api/projects/:projectId/discussions/:discussionId
 *  @desc Delete a discussion
 *  @access Private
 */
router.delete(
  '/:projectId/discussions/:discussionId',
  auth,
  [checkObjectId('projectId'), checkObjectId('discussionId')],
  deleteDiscussion
);

export default router;
