import express from 'express';
const router = express.Router();
import { check } from 'express-validator';

import auth from '../../middlewares/auth';
import validateInput from '../../middlewares/validateInput';
import checkObjectId from '../../middlewares/checkObjectId';
import upload from '../../middlewares/upload';
import { createFile } from '../../controllers/file';

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
  check('name', "name can't be empty").notEmpty(),
  validateInput,
  createFile
);

export default router;
