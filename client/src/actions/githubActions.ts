import { Dispatch } from 'redux';
import { History } from 'history';

import {
  REPOSITORY_LOADED,
  REPOSITORIES_LOADED,
  REPOSITORY_STORED,
  COMMITS_LOADED,
  PULLS_LOADED,
  GITHUB_FAIL,
  CLEAR_GITHUB,
  GithubDispatchTypes,
} from './githubTypes';
import api from '../api';
import { ThunkDispatch } from 'redux-thunk';
import { removeAlert, setAlert } from './alertActions';
import { MessageType } from './alertTypes';

//Load all repos
export const loadRepos = (projectId: string) => async (
  dispatch: Dispatch<GithubDispatchTypes>
) => {
  try {
    const res = await api.get(`/projects/${projectId}/github/repos`);

    dispatch({ type: REPOSITORIES_LOADED, payload: res.data });
  } catch (err) {
    dispatch({
      type: GITHUB_FAIL,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

//Load a repository
export const loadRepo = (projectId: string) => async (
  dispatch: Dispatch<GithubDispatchTypes>
) => {
  try {
    const res = await api.get(`/projects/${projectId}/github/repo`);

    dispatch({ type: REPOSITORY_LOADED, payload: res.data });
  } catch (err) {
    dispatch({
      type: GITHUB_FAIL,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

//Store chosen repository
export const storeRepo = (
  projectId: string,
  repositoryName: string,
  history: History
) => async (dispatch: ThunkDispatch<{}, {}, GithubDispatchTypes>) => {
  try {
    dispatch(removeAlert());

    await api.put(`/projects/${projectId}/github/repos`, {
      repositoryName,
    });

    dispatch({ type: REPOSITORY_STORED });
    history.push(`/projects/${projectId}/github-activity`);
  } catch (err) {
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach((error: any) =>
        dispatch(setAlert(error.msg, MessageType.Fail, error.param))
      );

      dispatch({
        type: GITHUB_FAIL,
        payload: { msg: err.response.statusText, status: err.response.status },
      });
    }
  }
};

//Load all the commits
export const loadCommits = (projectId: string, page: number) => async (
  dispatch: Dispatch<GithubDispatchTypes>
) => {
  try {
    const res = await api.get(`/projects/${projectId}/github/commits/${page}`);
    dispatch({ type: COMMITS_LOADED, payload: res.data });
  } catch (err) {
    dispatch({
      type: GITHUB_FAIL,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

//Load all the pulls
export const loadPulls = (projectId: string, page: number) => async (
  dispatch: Dispatch<GithubDispatchTypes>
) => {
  try {
    const res = await api.get(`/projects/${projectId}/github/pulls/${page}`);
    dispatch({ type: PULLS_LOADED, payload: res.data });
  } catch (err) {
    dispatch({
      type: GITHUB_FAIL,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

//Clear all github state
export const clearGithub = () => (dispatch: Dispatch<GithubDispatchTypes>) => {
  dispatch({ type: CLEAR_GITHUB });
};
