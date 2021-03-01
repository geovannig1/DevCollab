import express from 'express';
const router = express.Router();
import { check } from 'express-validator';

import auth from '../../middlewares/auth';
import validateInput from '../../middlewares/validateInput';
import checkObjectId from '../../middlewares/checkObjectId';
import upload from '../../middlewares/upload';
import {
  createFile,
  deleteFile,
  getFiles,
  getFile,
  updateFile,
} from '../../controllers/file';

/**
 *  @route GET api/projects/:projectId/files
 *  @desc Get all files
 *  @access Private
 */
router.get('/:projectId/files', auth, getFiles);

/**
 *  @route GET api/projects/:projectId/files/:fileId
 *  @desc Get a file
 *  @access Private
 */
router.get('/:projectId/files/:fileId', auth, getFile);

/**
 *  @route POST api/projects/:projectId/files
 *  @desc create a new fle
 *  @access Private
 */
router.post(
  '/:projectId/files',
  auth,
  checkObjectId('projectId'),
  upload.single('file'),
  check('name', "File name can't be empty").notEmpty(),
  validateInput,
  createFile
);

/**
 *  @route PATCH api/projects/:projectId/files/:fileId
 *  @desc Update a file
 *  @access Private
 */
router.patch(
  '/:projectId/files/:fileId',
  auth,
  [checkObjectId('projectId'), checkObjectId('fileId')],
  upload.single('file'),
  check('name', "File name can't be empty").notEmpty(),
  validateInput,
  updateFile
);

/**
 *  @route DELETE api/projects/:projectId/files/:fileId
 *  @desc Delete a file
 *  @access Private
 */
router.delete(
  '/:projectId/files/:fileId',
  auth,
  [checkObjectId('projectId'), checkObjectId('fileId')],
  deleteFile
);

export default router;
