import { Dispatch } from 'redux';

import api from '../api';
import {
  TASKSTATE_LOADED,
  TASK_FAIL,
  CLEAR_TASK,
  TaskDispatchTypes,
} from './taskTypes';

//Load initial taskdata
export const loadTaskState = (projectId: string) => async (
  dispatch: Dispatch<TaskDispatchTypes>
) => {
  try {
    const res = await api.get(`/projects/${projectId}/tasks`);
    dispatch({ type: TASKSTATE_LOADED, payload: res.data });
  } catch (err) {
    dispatch({
      type: TASK_FAIL,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

//Clear taskdata
export const clearTask = () => async (
  dispatch: Dispatch<TaskDispatchTypes>
) => {
  dispatch({ type: CLEAR_TASK });
};
