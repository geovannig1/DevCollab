import {
  AlertDispatchType,
  REMOVE_ALERT,
  SET_ALERT,
  AlertType,
} from '../actions/alertTypes';

export interface AlertInitialState extends Array<AlertType> {
  [index: number]: AlertType;
}

const alertInitialState: AlertInitialState = [];

const alertReducer = (
  state = alertInitialState,
  action: AlertDispatchType
): AlertInitialState => {
  switch (action.type) {
    case SET_ALERT:
      return [...state, action.payload];
    case REMOVE_ALERT:
      return action.payload === 'all'
        ? []
        : state.filter((alert) => alert.location !== action.payload);
    default:
      return state;
  }
};

export default alertReducer;
