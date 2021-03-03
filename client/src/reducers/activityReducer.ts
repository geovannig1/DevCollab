import {
  ACTIVITY_LOADED,
  ACTIVITY_FAIL,
  ACTIVITY_RECEIVED,
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
    case ACTIVITY_FAIL:
      return { ...state, activityError: action.payload };
    default:
      return state;
  }
};

export default activityReducer;
