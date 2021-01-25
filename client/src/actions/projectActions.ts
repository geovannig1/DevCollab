import { Dispatch } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { History } from 'history';

import api from '../api';
import { setAlert } from './alertActions';
import { MessageType } from './alertTypes';
import { LoadingDispatch, SET_LOADING, REMOVE_LOADING } from './authTypes';
import {
  PROJECT_LOADED,
  PROJECT_CLEAR,
  ProjectDispatchTypes,
  CreateProjectData,
} from './projectTypes';

//Load user projects
export const loadProjects = () => async (
  dispatch: Dispatch<ProjectDispatchTypes | LoadingDispatch>
) => {
  try {
    dispatch({ type: SET_LOADING });

    const res = await api.get('/projects');

    dispatch({ type: PROJECT_LOADED, payload: res.data });
    dispatch({ type: REMOVE_LOADING });
  } catch (err) {
    dispatch({ type: PROJECT_CLEAR });
    dispatch({ type: REMOVE_LOADING });
  }
};

//Clear user project
export const clearProject = () => (
  dispatch: Dispatch<ProjectDispatchTypes>
) => {
  dispatch({ type: PROJECT_CLEAR });
};

//Create new project
export const createProject = (
  createProjectData: CreateProjectData,
  history: History
) => async (dispatch: ThunkDispatch<{}, {}, ProjectDispatchTypes>) => {
  try {
    await api.post('/projects', createProjectData);

    dispatch(loadProjects());
    history.push('/projects');
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach((error: any) =>
        dispatch(setAlert(error.msg, MessageType.Fail, error.params))
      );
    }
  }
};
