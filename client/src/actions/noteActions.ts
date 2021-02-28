import { ThunkDispatch } from 'redux-thunk';
import { History } from 'history';

import { setAlert, removeAlert } from './alertActions';
import { MessageType } from './alertTypes';
import api from '../api';
import {
  NOTES_LOADED,
  NOTE_LOADED,
  NOTE_CREATED,
  NOTE_FAIL,
  NOTE_UPDATED,
  NOTE_DELETED,
  CLEAR_NOTE,
  CLEAR_SELECTED_NOTE,
  NoteDispatchTypes,
  NoteTypes,
} from './noteTypes';

//Get all notes
export const loadNotes = (projectId: string) => async (
  dispatch: ThunkDispatch<{}, {}, NoteDispatchTypes>
) => {
  try {
    const res = await api.get(`/projects/${projectId}/notes`);
    dispatch({ type: NOTES_LOADED, payload: res.data });
  } catch (err) {
    dispatch({
      type: NOTE_FAIL,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

//Get a note
export const loadNote = (projectId: string, noteId: string) => async (
  dispatch: ThunkDispatch<{}, {}, NoteDispatchTypes>
) => {
  try {
    const res = await api.get(`/projects/${projectId}/notes/${noteId}`);
    dispatch({ type: NOTE_LOADED, payload: res.data });
  } catch (err) {
    dispatch({
      type: NOTE_FAIL,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

//Create a new note
export const createNote = (
  projectId: string,
  noteData: NoteTypes,
  history: History
) => async (dispatch: ThunkDispatch<{}, {}, NoteDispatchTypes>) => {
  try {
    dispatch(removeAlert());

    const res = await api.post(`/projects/${projectId}/notes`, noteData);
    dispatch({ type: NOTE_CREATED, payload: res.data });
    history.push(`/projects/${projectId}/notes`);
  } catch (err) {
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach((error: any) =>
        dispatch(setAlert(error.msg, MessageType.Fail, error.param))
      );

      dispatch({
        type: NOTE_FAIL,
        payload: { msg: err.response.statusText, status: err.response.status },
      });
    }
  }
};

//Update a note
export const updateNote = (
  projectId: string,
  noteId: string,
  noteData: NoteTypes,
  history: History
) => async (dispatch: ThunkDispatch<{}, {}, NoteDispatchTypes>) => {
  try {
    dispatch(removeAlert());

    const res = await api.patch(
      `/projects/${projectId}/notes/${noteId}`,
      noteData
    );
    dispatch({ type: NOTE_UPDATED, payload: res.data });
    history.push(`/projects/${projectId}/notes`);
  } catch (err) {
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach((error: any) =>
        dispatch(setAlert(error.msg, MessageType.Fail, error.param))
      );

      dispatch({
        type: NOTE_FAIL,
        payload: { msg: err.response.statusText, status: err.response.status },
      });
    }
  }
};

//Delete a note
export const deleteNote = (projectId: string, noteId: string) => async (
  dispatch: ThunkDispatch<{}, {}, NoteDispatchTypes>
) => {
  try {
    await api.delete(`/projects/${projectId}/notes/${noteId}`);
    dispatch({ type: NOTE_DELETED, payload: noteId });
  } catch (err) {
    dispatch({
      type: NOTE_FAIL,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

//Clear note
export const clearNote = () => async (
  dispatch: ThunkDispatch<{}, {}, NoteDispatchTypes>
) => {
  dispatch({ type: CLEAR_NOTE });
};

//Clear the selected note
export const clearSelectedNote = () => async (
  dispatch: ThunkDispatch<{}, {}, NoteDispatchTypes>
) => {
  dispatch({ type: CLEAR_SELECTED_NOTE });
};
