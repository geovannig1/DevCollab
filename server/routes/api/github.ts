import express from 'express';
const router = express.Router();

import checkObjectId from '../../middlewares/checkObjectId';
import {
  storeRepository,
  getRepositories,
  githubHook,
  getCommits,
} from '../../controllers/github';
import { check } from 'express-validator';
import auth from '../../middlewares/auth';
import validateInput from '../../middlewares/validateInput';

/**
 *  @route POST  api/projects/github/hook
 *  @desc github webhook listener
 *  @access Public
 */
router.post('/github/hook', githubHook);

/**
 *  @route GET api/projects/:projectId/github/repos
 *  @desc Get all repost
 *  @access Private
 */
router.get(
  '/:projectId/github/repos',
  auth,
  checkObjectId('projectId'),
  getRepositories
);

/**
 *  @route PUT api/projects/:projectId/github/repos
 *  @desc Store repo data
 *  @access Private
 */
router.put(
  '/:projectId/github/repos',
  auth,
  checkObjectId('projectId'),
  check('repositoryName', "Repository can't be empty").notEmpty(),
  validateInput,
  storeRepository
);

/**
 *  @route PUT api/projects/:projectId/github/commits/:page
 *  @desc Get commits per page from a repo
 *  @access Private
 */
router.get(
  '/:projectId/github/commits/:page',
  auth,
  checkObjectId('projectId'),
  getCommits
);

export default router;
