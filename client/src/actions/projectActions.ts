import { Dispatch } from 'redux';

import api from '../api';
import { LoadingDispatch, SET_LOADING, REMOVE_LOADING } from './authTypes';
import {
  PROJECT_LOADED,
  PROJECT_CLEAR,
  ProjectDispatchTypes,
  ProjectClear,
} from './projectTypes';

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

export const clearProject = () => (dispatch: Dispatch<ProjectClear>) => {
  dispatch({ type: PROJECT_CLEAR });
};
