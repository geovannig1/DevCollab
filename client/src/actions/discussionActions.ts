import { ThunkDispatch } from 'redux-thunk';

import {
  DiscussionType,
  DISCUSSION_LOADED,
  DISCUSSION_FAIL,
  DISCUSSION_CREATED,
  DiscussionDispatchTypes,
} from './discussionTypes';
import api from '../api';
import { setAlert } from './alertActions';
import { MessageType } from './alertTypes';

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
