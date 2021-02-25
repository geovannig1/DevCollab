import { ThunkDispatch } from 'redux-thunk';

import {
  DiscussionType,
  DISCUSSIONS_LOADED,
  DISCUSSION_LOADED,
  DISCUSSION_UPDATED,
  DISCUSSION_DELETED,
  COMMENT_RECEIVED,
  DISCUSSION_FAIL,
  DISCUSSION_CREATED,
  CLEAR_DISCUSSION,
  DiscussionDispatchTypes,
} from './discussionTypes';
import api from '../api';
import { setAlert } from './alertActions';
import { MessageType } from './alertTypes';

//Get all discussions
export const loadDiscussions = (projectId: string) => async (
  dispatch: ThunkDispatch<{}, {}, DiscussionDispatchTypes>
) => {
  try {
    const res = await api.get(`/projects/${projectId}/discussions`);

    dispatch({ type: DISCUSSIONS_LOADED, payload: res.data });
  } catch (err) {
    dispatch({
      type: DISCUSSION_FAIL,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

//Get a discussion
export const loadDiscussion = (
  projectId: string,
  discussionId: string
) => async (dispatch: ThunkDispatch<{}, {}, DiscussionDispatchTypes>) => {
  try {
    const res = await api.get(
      `/projects/${projectId}/discussions/${discussionId}`
    );

    dispatch({ type: DISCUSSION_LOADED, payload: res.data });
  } catch (err) {
    dispatch({
      type: DISCUSSION_FAIL,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

//Create a new discussion
export const createDiscussion = (
  history: any,
  projectId: string,
  formData: DiscussionType,
  attachment?: File
) => async (dispatch: ThunkDispatch<{}, {}, DiscussionDispatchTypes>) => {
  try {
    //Create multipart/form-data
    const fd = new FormData();

    const { title, description } = formData;

    fd.append('title', title);
    fd.append('description', description);
    if (attachment) fd.append('attachment', attachment);

    const res = await api.post(`/projects/${projectId}/discussions`, fd);

    dispatch({ type: DISCUSSION_CREATED, payload: res.data });

    history.push(`/projects/${projectId}/discussions`);
  } catch (err) {
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach((error: any) =>
        dispatch(setAlert(error.msg, MessageType.Fail, error.param))
      );

      dispatch({
        type: DISCUSSION_FAIL,
        payload: { msg: err.response.statusText, status: err.response.status },
      });
    }
  }
};

//Update a discussion
export const updateDiscussion = (
  history: any,
  projectId: string,
  discussionId: string,
  formData: DiscussionType,
  attachment?: File
) => async (dispatch: ThunkDispatch<{}, {}, DiscussionDispatchTypes>) => {
  try {
    //Create multipart/form-data
    const fd = new FormData();

    const { title, description } = formData;

    fd.append('title', title);
    fd.append('description', description);
    if (attachment) fd.append('attachment', attachment);

    const res = await api.patch(
      `/projects/${projectId}/discussions/${discussionId}`,
      fd
    );

    dispatch({ type: DISCUSSION_UPDATED, payload: res.data });

    history.push(`/projects/${projectId}/discussions`);
  } catch (err) {
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach((error: any) =>
        dispatch(setAlert(error.msg, MessageType.Fail, error.param))
      );

      dispatch({
        type: DISCUSSION_FAIL,
        payload: { msg: err.response.statusText, status: err.response.status },
      });
    }
  }
};

//Delete a discussion
export const deleteDiscussion = (
  projectId: string,
  discussionId: string
) => async (dispatch: ThunkDispatch<{}, {}, DiscussionDispatchTypes>) => {
  try {
    await api.delete(`/projects/${projectId}/discussions/${discussionId}`);

    dispatch({ type: DISCUSSION_DELETED, payload: discussionId });
  } catch (err) {
    dispatch({
      type: DISCUSSION_FAIL,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

//Receive a comment
export const receiveComment = (discussionData: DiscussionType) => (
  dispatch: ThunkDispatch<{}, {}, DiscussionDispatchTypes>
) => {
  try {
    dispatch({ type: COMMENT_RECEIVED, payload: discussionData });
  } catch (err) {
    dispatch({
      type: DISCUSSION_FAIL,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

//Clear all discussion
export const clearDiscussion = () => (
  dispatch: ThunkDispatch<{}, {}, DiscussionDispatchTypes>
) => {
  dispatch({ type: CLEAR_DISCUSSION });
};
