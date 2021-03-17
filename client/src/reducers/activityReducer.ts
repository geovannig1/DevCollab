import {
  ACTIVITY_LOADED,
  ACTIVITY_FAIL,
  ACTIVITY_RECEIVED,
  NOTIFICATION_REMOVED,
  CLEAR_ACTIVITY,
  ActivityDispatchTypes,
  ActivityTypes,
} from '../actions/activityTypes';

export interface ActivityInitialState {
  activity?: ActivityTypes;
  activityError?: { msg: string; status: number };
}

const activityInitialState: ActivityInitialState = {};

const activityReducer = (
  state = activityInitialState,
  action: ActivityDispatchTypes
): ActivityInitialState => {
  switch (action.type) {
    case ACTIVITY_LOADED:
      return { ...state, activity: action.payload };
    case ACTIVITY_RECEIVED:
      return { ...state, activity: action.payload };
    case NOTIFICATION_REMOVED:
      return { ...state, activity: action.payload };
    case ACTIVITY_FAIL:
      return { ...state, activityError: action.payload };
    case CLEAR_ACTIVITY:
      return { ...state, activity: undefined, activityError: undefined };
    default:
      return state;
  }
};

export default activityReducer;
