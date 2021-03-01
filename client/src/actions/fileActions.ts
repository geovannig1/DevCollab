import { ThunkDispatch } from 'redux-thunk';
import { Dispatch } from 'redux';
import { History } from 'history';

import api from '../api';
import { setAlert, removeAlert } from './alertActions';
import { MessageType } from './alertTypes';

import {
  FILES_LOADED,
  FILE_LOADED,
  FILE_CREATED,
  FILE_UPDATED,
  FILE_DELETED,
  CLEAR_FILE,
  CLEAR_SELECTED_FILE,
  FILE_FAIL,
  FileDispatchTypes,
} from './fileTypes';

//Get all files
export const loadFiles = (projectId: string) => async (
  dispatch: Dispatch<FileDispatchTypes>
) => {
  try {
    const res = await api.get(`/projects/${projectId}/files`);
    dispatch({ type: FILES_LOADED, payload: res.data });
  } catch (err) {
    dispatch({
      type: FILE_FAIL,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

//Get a file
export const loadFile = (projectId: string, fileId: string) => async (
  dispatch: Dispatch<FileDispatchTypes>
) => {
  try {
    const res = await api.get(`/projects/${projectId}/files/${fileId}`);
    dispatch({ type: FILE_LOADED, payload: res.data });
  } catch (err) {
    dispatch({
      type: FILE_FAIL,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

//Create a new file
export const createFile = (
  projectId: string,
  history: History,
  name: string,
  file?: File
) => async (dispatch: ThunkDispatch<{}, {}, FileDispatchTypes>) => {
  try {
    dispatch(removeAlert());

    //Create multipart/form-data
    const fd = new FormData();

    fd.append('name', name);
    if (file) fd.append('file', file);

    const res = await api.post(`/projects/${projectId}/files`, fd);
    dispatch({ type: FILE_CREATED, payload: res.data });

    history.push(`/projects/${projectId}/files`);
  } catch (err) {
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach((error: any) =>
        dispatch(setAlert(error.msg, MessageType.Fail, error.param))
      );

      dispatch({
        type: FILE_FAIL,
        payload: { msg: err.response.statusText, status: err.response.status },
      });
    }
  }
};

//Update a file
export const updateFile = (
  projectId: string,
  fileId: string,
  history: History,
  name: string,
  file?: File
) => async (dispatch: ThunkDispatch<{}, {}, FileDispatchTypes>) => {
  dispatch(removeAlert());

  //Create multipart/form-data
  const fd = new FormData();

  fd.append('name', name);
  if (file) fd.append('file', file);

  const res = await api.patch(`/projects/${projectId}/files/${fileId}`, fd);
  dispatch({ type: FILE_UPDATED, payload: res.data });

  history.push(`/projects/${projectId}/files`);
};

//Delete a file
export const deleteFile = (projectId: string, fileId: string) => async (
  dispatch: Dispatch<FileDispatchTypes>
) => {
  try {
    await api.delete(`/projects/${projectId}/files/${fileId}`);
    dispatch({ type: FILE_DELETED, payload: fileId });
  } catch (err) {
    dispatch({
      type: FILE_FAIL,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

//Clear file state
export const clearFile = () => (dispatch: Dispatch<FileDispatchTypes>) => {
  dispatch({ type: CLEAR_FILE });
};

//Clear selected file
export const clearSelectedFile = () => (
  dispatch: Dispatch<FileDispatchTypes>
) => {
  dispatch({ type: CLEAR_SELECTED_FILE });
};
