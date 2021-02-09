import { Dispatch } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { History } from 'history';

import api from '../api';
import { setAlert } from './alertActions';
import { MessageType } from './alertTypes';
import { LoadingDispatch, SET_LOADING, REMOVE_LOADING } from './authTypes';
import {
  PROJECTS_LOADED,
  PROJECT_LOADED,
  PROJECT_CREATED,
  PROJECT_UPDATED,
  PROJECT_CLEAR,
  PROJECT_DELETED,
  ProjectDispatchTypes,
  ProjectData,
  PROJECT_ERROR,
} from './projectTypes';

//Load user projects
export const loadProjects = () => async (
  dispatch: Dispatch<ProjectDispatchTypes | LoadingDispatch>
) => {
  try {
    dispatch({ type: SET_LOADING });

    const res = await api.get('/projects');

    dispatch({ type: PROJECTS_LOADED, payload: res.data });
    dispatch({ type: REMOVE_LOADING });
  } catch (err) {
    dispatch({
      type: PROJECT_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });

    dispatch({ type: PROJECT_CLEAR });
    dispatch({ type: REMOVE_LOADING });
  }
};

export const loadProject = (projectId: string) => async (
  dispatch: Dispatch<ProjectDispatchTypes | LoadingDispatch>
) => {
  try {
    dispatch({ type: SET_LOADING });

    const res = await api.get(`/projects/${projectId}`);
    dispatch({ type: PROJECT_LOADED, payload: res.data });
    dispatch({ type: REMOVE_LOADING });
  } catch (err) {
    dispatch({
      type: PROJECT_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });

    dispatch({ type: REMOVE_LOADING });
  }
};

//Create new project
export const createProject = (
  projectData: ProjectData,
  history: History
) => async (dispatch: ThunkDispatch<{}, {}, ProjectDispatchTypes>) => {
  try {
    const res = await api.post('/projects', projectData);

    dispatch({ type: PROJECT_CREATED, payload: res.data });

    history.push('/projects');
  } catch (err) {
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach((error: any) =>
        dispatch(setAlert(error.msg, MessageType.Fail, error.params))
      );
    }

    dispatch({
      type: PROJECT_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

//Update project
export const updateProject = (
  projectData: ProjectData,
  projectId: string,
  history: History
) => async (dispatch: ThunkDispatch<{}, {}, ProjectDispatchTypes>) => {
  try {
    const res = await api.patch(`/projects/${projectId}`, projectData);

    dispatch({
      type: PROJECT_UPDATED,
      payload: { project: res.data, id: projectId },
    });

    history.push('/projects');
  } catch (err) {
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach((error: any) =>
        dispatch(setAlert(error.msg, MessageType.Fail, error.params))
      );
    }

    dispatch({
      type: PROJECT_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

//Delete project
export const deleteProject = (projectId: string) => async (
  dispatch: ThunkDispatch<{}, {}, ProjectDispatchTypes>
) => {
  try {
    await api.delete(`/projects/${projectId}`);
    dispatch({ type: PROJECT_DELETED, payload: projectId });
  } catch (err) {
    dispatch({
      type: PROJECT_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

//Clear user project
export const clearProject = () => (
  dispatch: Dispatch<ProjectDispatchTypes>
) => {
  dispatch({ type: PROJECT_CLEAR });
};
