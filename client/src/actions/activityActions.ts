import { Dispatch } from 'redux';

import {
  ACTIVITY_LOADED,
  ACTIVITY_RECEIVED,
  ACTIVITY_FAIL,
  NOTIFICATION_REMOVED,
  CLEAR_ACTIVITY,
  ActivityDispatchTypes,
  ActivityTypes,
} from './activityTypes';
import api from '../api';

//Load project activity
export const loadActivity = (projectId: string) => async (
  dispatch: Dispatch<ActivityDispatchTypes>
) => {
  try {
    const res = await api.get(`/projects/${projectId}/activity`);
    dispatch({ type: ACTIVITY_LOADED, payload: res.data });
  } catch (err) {
    dispatch({
      type: ACTIVITY_FAIL,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

//Receive new activity
export const receiveActivity = (activityData: ActivityTypes) => (
  dispatch: Dispatch<ActivityDispatchTypes>
) => {
  dispatch({ type: ACTIVITY_RECEIVED, payload: activityData });
};

//Remove notification
export const removeNotification = (projectId: string) => async (
  dispatch: Dispatch<ActivityDispatchTypes>
) => {
  try {
    const res = await api.patch(
      `/projects/${projectId}/activities/notification`
    );
    dispatch({ type: NOTIFICATION_REMOVED, payload: res.data });
  } catch (err) {
    dispatch({
      type: ACTIVITY_FAIL,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

//Clear all activities
export const clearActivity = () => (
  dispatch: Dispatch<ActivityDispatchTypes>
) => {
  dispatch({ type: CLEAR_ACTIVITY });
};
