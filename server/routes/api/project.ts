import express from 'express';
const router = express.Router();
import { check } from 'express-validator';

import auth from '../../middlewares/auth';
import validateInput from '../../middlewares/validateInput';
import {
  createProject,
  getProjects,
  getProject,
  confirmInvitation,
  deleteProject,
  updateProject,
} from '../../controllers/project';

/**
 *  @route POST api/projects
 *  @desc Create new project
 *  @access Private
 */
router.post(
  '/',
  auth,
  check('name', 'Project name is required').notEmpty(),
  validateInput,
  createProject
);

/**
 *  @route GET api/projects
 *  @desc Get signed in user projects
 *  @access Private
 */
router.get('/', auth, getProjects);

/**
 *  @route GET api/projects/:projectId
 *  @desc Get signed in user project
 *  @access Private
 */
router.get('/:projectId', auth, getProject);

/**
 *  @route GET api/projects/:projectId
 *  @desc Get signed in user projects
 *  @access Private
 */
router.patch(
  '/:projectId',
  auth,
  check('name', 'Project name is required').notEmpty(),
  validateInput,
  updateProject
);

/**
 *  @route DELETE api/projects/:projectId
 *  @desc Delete a project
 *  @access Private
 */
router.delete('/:projectId', auth, deleteProject);

/**
 *  @route GET api/projects/invitation/token
 *  @desc Confirm project invitation
 *  @access Public
 */
router.get('/invitation/:token', confirmInvitation);

export default router;
