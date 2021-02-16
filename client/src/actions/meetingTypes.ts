export const MEETINGS_LOADED = 'MEETINGS_LOADED';
export const MEETING_LOADED = 'MEETING_LOADED';
export const MEETING_CREATED = 'MEETING_CREATED';
export const MEETING_FAIL = 'MEETING_FAIL';
export const CLEAR_MEETING = 'CLEAR_MEETING';

export interface Member {
  user: {
    _id: string;
    email?: string;
    avatar?: {
      url: string;
    };
  };
}

export interface MeetingTypes {
  _id?: string;
  name: string;
  members: Member[];
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

export interface MeetingFail {
  type: typeof MEETING_FAIL;
  payload: {
    msg: string;
    status: string;
  };
}

export interface ClearMeeting {
  type: typeof CLEAR_MEETING;
}

export type MeetingDispatchTypes =
  | MeetingsLoaded
  | MeetingLoaded
  | MeetingCreated
  | MeetingFail
  | ClearMeeting;
