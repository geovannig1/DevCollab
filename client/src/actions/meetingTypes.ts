export const MEETING_CREATED = 'MEETING_CREATED';
export const MEETING_FAIL = 'MEETING_FAIL';

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

export type MeetingDispatchTypes = MeetingCreated | MeetingFail;
