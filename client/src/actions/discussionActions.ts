import { ThunkDispatch } from 'redux-thunk';

import {
  DiscussionType,
  DISCUSSIONS_LOADED,
  DISCUSSION_LOADED,
  COMMENT_RECEIVED,
  DISCUSSION_FAIL,
  DISCUSSION_CREATED,
  CLEAR_DISCUSSION,
  DiscussionDispatchTypes,
} from './discussionTypes';
import api from '../api';
import { setAlert } from './alertActions';
import { MessageType } from './alertTypes';

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

export const createDiscussion = (
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

export const receiveComment = (discussionData: DiscussionType) => (
  dispatch: ThunkDispatch<{}, {}, DiscussionDispatchTypes>
) => {
  dispatch({ type: COMMENT_RECEIVED, payload: discussionData });

  try {
  } catch (err) {
    dispatch({
      type: DISCUSSION_FAIL,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

export const clearDiscussion = () => (
  dispatch: ThunkDispatch<{}, {}, DiscussionDispatchTypes>
) => {
  dispatch({ type: CLEAR_DISCUSSION });
};
