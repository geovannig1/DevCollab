import {
  AlertDispatchType,
  REMOVE_ALERT,
  SET_ALERT,
  MessageType,
} from '../actions/alertTypes';

export interface AlertInitialState extends Array<object> {
  [index: number]: {
    message: string;
    messageType: MessageType;
    location: string;
  };
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
      return (state = []);
    default:
      return state;
  }
};

export default alertReducer;
