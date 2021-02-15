import { ThunkDispatch } from 'redux-thunk';
import { setAlert } from './alertActions';
import { MessageType } from './alertTypes';

import {
  MEETING_CREATED,
  MEETING_FAIL,
  MeetingDispatchTypes,
  MeetingTypes,
} from './meetingTypes';
import api from '../api';

export const createMeeting = (
  projectId: string,
  formData: MeetingTypes
) => async (dispatch: ThunkDispatch<{}, {}, MeetingDispatchTypes>) => {
  try {
    const res = await api.post(`/projects/${projectId}/meetings`, formData);

    dispatch({ type: MEETING_CREATED, payload: res.data });
  } catch (err) {
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach((error: any) =>
        dispatch(setAlert(error.msg, MessageType.Fail, error.param))
      );

      dispatch({
        type: MEETING_FAIL,
        payload: { msg: err.response.statusText, status: err.response.status },
      });
    }
  }
};
