import {
  REMOVE_ALERT,
  SET_ALERT,
  AlertDispatchType,
  MessageType,
} from './alertTypes';
import { Dispatch } from 'redux';

export const setAlert = (
  message: string,
  messageType: MessageType,
  location: string
) => (dispatch: Dispatch<AlertDispatchType>) => {
  dispatch({ type: SET_ALERT, payload: { message, messageType, location } });
};

export const removeAlert = (location = 'all') => (
  dispatch: Dispatch<AlertDispatchType>
) => {
  dispatch({ type: REMOVE_ALERT, payload: location });
};
