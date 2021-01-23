import {
  AlertDispatchType,
  REMOVE_ALERT,
  SET_ALERT,
  MessageType,
} from '../actions/alertTypes';

export interface AlertType {
  message: string;
  messageType: MessageType;
  location: string;
}

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
