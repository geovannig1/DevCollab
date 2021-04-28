export const MEETINGS_LOADED = 'MEETINGS_LOADED';
export const MEETING_LOADED = 'MEETING_LOADED';
export const MEETING_CREATED = 'MEETING_CREATED';
export const MEETING_UPDATED = 'MEETING_UPDATED';
export const MEETING_DELETED = 'MEETING_DELETED';
export const MEETING_FAIL = 'MEETING_FAIL';
export const CLEAR_MEETING = 'CLEAR_MEETING';
export const CLEAR_SELECTED_MEETING = 'CLEAR_SELECTED_MEETING';

export interface Member {
  user: {
    _id: string;
    email?: string;
    avatar?: {
      url: string;
    };
    firstName?: string;
    lastName?: string;
  };
}

export interface MeetingTypes {
  _id?: string;
  name: string;
  members: Member[];
  usersInRoom?: string[];
  iceServer?: any[];
}

export interface MeetingsLoaded {
  type: typeof MEETINGS_LOADED;
  payload: MeetingTypes[];
}

export interface MeetingLoaded {
  type: typeof MEETING_LOADED;
  payload: MeetingTypes;
}

export interface MeetingCreated {
  type: typeof MEETING_CREATED;
  payload: MeetingTypes;
}

export interface MeetingUpdated {
  type: typeof MEETING_UPDATED;
  payload: MeetingTypes;
}

export interface MeetingDeleted {
  type: typeof MEETING_DELETED;
  payload: string;
}

export interface MeetingFail {
  type: typeof MEETING_FAIL;
  payload: {
    msg: string;
    status: number;
  };
}

export interface ClearMeeting {
  type: typeof CLEAR_MEETING;
}

export interface ClearSelectedMeeting {
  type: typeof CLEAR_SELECTED_MEETING;
}

export type MeetingDispatchTypes =
  | MeetingsLoaded
  | MeetingLoaded
  | MeetingCreated
  | MeetingUpdated
  | MeetingDeleted
  | MeetingFail
  | ClearMeeting
  | ClearSelectedMeeting;
