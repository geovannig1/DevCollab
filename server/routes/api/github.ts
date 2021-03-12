import express from 'express';
const router = express.Router();

import checkObjectId from '../../middlewares/checkObjectId';
import {
  storeRepository,
  getRepositories,
  githubHook,
  getCommits,
  getPulls,
  getRepository,
  getEvents,
} from '../../controllers/github';
import { check } from 'express-validator';
import auth from '../../middlewares/auth';
import validateInput from '../../middlewares/validateInput';

/**
 *  @route POST api/projects/github/hook
 *  @desc github webhook listener
 *  @access Public
 */
router.post('/github/hook', githubHook);

/**
 *  @route GET api/projects/:projectId/github/events
 *  @desc Get all events
 *  @access Private
 */
router.get('/:projectId/github/events', auth, getEvents);

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
 *  @route GET api/projects/:projectId/github/repo
 *  @desc Get a user repository
 *  @access Private
 */
router.get(
  '/:projectId/github/repo',
  auth,
  checkObjectId('projectId'),
  getRepository
);

/**
 *  @route GET api/projects/:projectId/github/commits/:page
 *  @desc Get commits per page from a repo
 *  @access Private
 */
router.get(
  '/:projectId/github/commits/:page',
  auth,
  checkObjectId('projectId'),
  getCommits
);

/**
 *  @route GET api/projects/:projectId/github/pulls/:page
 *  @desc Get pull requests per page from a repo
 *  @access Private
 */
router.get(
  '/:projectId/github/pulls/:page',
  auth,
  checkObjectId('projectId'),
  getPulls
);

export default router;
