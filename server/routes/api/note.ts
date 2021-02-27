import express from 'express';
const router = express.Router();
import { check } from 'express-validator';

import auth from '../../middlewares/auth';
import validateInput from '../../middlewares/validateInput';
import checkObjectId from '../../middlewares/checkObjectId';
import { createNote, getNotes, updateNote } from '../../controllers/note';

/**
 *  @route GET api/projects/:projectId/notes
 *  @desc Load all project notes
 *  @access Private
 */
router.get('/:projectId/notes', auth, checkObjectId('projectId'), getNotes);

/**
 *  @route POST api/projects/:projectId/notes
 *  @desc create a new note
 *  @access Private
 */
router.post(
  '/:projectId/notes',
  auth,
  [
    check('title', "Title can't be empty").notEmpty(),
    check('contents', "Contents can't be empty").notEmpty(),
  ],
  checkObjectId('projectId'),
  validateInput,
  createNote
);

/**
 *  @route PATCH api/projects/:projectId/notes/:noteId
 *  @desc update a note
 *  @access Private
 */
router.patch(
  '/:projectId/notes/:noteId',
  auth,
  [
    check('title', "Title can't be empty").notEmpty(),
    check('contents', "Contents can't be empty").notEmpty(),
  ],
  [checkObjectId('projectId'), checkObjectId('noteId')],
  validateInput,
  updateNote
);

export default router;
