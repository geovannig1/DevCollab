import { ThunkDispatch } from 'redux-thunk';
import { History } from 'history';

import { setAlert, removeAlert } from './alertActions';
import { MessageType } from './alertTypes';
import api from '../api';
import {
  NOTES_LOADED,
  NOTE_CREATED,
  NOTE_FAIL,
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
