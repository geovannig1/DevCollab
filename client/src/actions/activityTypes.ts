export const ACTIVITY_LOADED = 'ACTIVITY_LOADED';
export const ACTIVITY_RECEIVED = 'ACTIVITY_RECEIVED';
export const ACTIVITY_FAIL = 'ACTIVITY_FAIL';
export const NOTIFICATION_REMOVED = 'NOTIFICATION_REMOVED';

export enum ActivityAvatar {
  task,
  discussion,
  meeting,
  github,
  note,
  file,
}

export interface Message {
  _id: string;
  message: string;
  user?: {
    _id: string;
    avatar: {
      url: string;
    };
    firstName: string;
    lastName: string;
  };
  avatar?: number;
  name?: string;
  date: Date;
}

export interface ActivityTypes {
  _id: string;
  messages: Message[];
  notifications?: {
    totalNotifications: number;
    user: string;
  }[];
}

export interface ActivityLoaded {
  type: typeof ACTIVITY_LOADED;
  payload: ActivityTypes;
}

export interface ActivityReceived {
  type: typeof ACTIVITY_RECEIVED;
  payload: ActivityTypes;
}

export interface ActivityFail {
  type: typeof ACTIVITY_FAIL;
  payload: {
    msg: string;
    status: number;
  };
}

export interface NotificationRemoved {
  type: typeof NOTIFICATION_REMOVED;
  payload: ActivityTypes;
}

export type ActivityDispatchTypes =
  | ActivityLoaded
  | ActivityReceived
  | ActivityFail
  | NotificationRemoved;
