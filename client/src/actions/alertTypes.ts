export const SET_ALERT = 'SET_ALERT';
export const REMOVE_ALERT = 'REMOVE_ALERT';

export enum MessageType {
  fail,
  success,
}

export type AlertType = {
  message: string;
  messageType: MessageType;
  location: string;
};

export interface SetAlert {
  type: typeof SET_ALERT;
  payload: AlertType;
}
export interface RemoveAlert {
  type: typeof REMOVE_ALERT;
}

export type AlertDispatchType = SetAlert | RemoveAlert;
