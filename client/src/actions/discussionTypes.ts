export const DISCUSSIONS_LOADED = 'DISCUSSIONS_LOADED';
export const DISCUSSION_LOADED = 'DISCUSSION_LOADED';
export const DISCUSSION_CREATED = 'DISCUSSION_CREATED';
export const COMMENT_RECEIVED = 'COMMENT_RECEIVED';
export const DISCUSSION_FAIL = 'DISCUSSION_FAIL';
export const CLEAR_DISCUSSION = 'CLEAR_DISCUSSION';

export interface DiscussionType {
  _id?: string;
  title: string;
  description: string;
  attachment?: {
    url: string;
  };
  creator?: string;
  date?: string;
  comments?: {
    _id: string;
    date: Date;
    user: {
      _id: string;
      email?: string;
      avatar?: {
        url: string;
      };
    };
    comment: string;
  }[];
}

export interface DiscussionsLoaded {
  type: typeof DISCUSSIONS_LOADED;
  payload: DiscussionType[];
}

export interface CommentReceived {
  type: typeof COMMENT_RECEIVED;
  payload: DiscussionType;
}

export interface DiscussionLoaded {
  type: typeof DISCUSSION_LOADED;
  payload: DiscussionType;
}

export interface DiscussionCreated {
  type: typeof DISCUSSION_CREATED;
  payload: DiscussionType;
}

export interface DiscussionFail {
  type: typeof DISCUSSION_FAIL;
  payload: { msg: string; status: string };
}

export interface ClearDiscussion {
  type: typeof CLEAR_DISCUSSION;
}

export type DiscussionDispatchTypes =
  | DiscussionsLoaded
  | DiscussionLoaded
  | DiscussionCreated
  | CommentReceived
  | DiscussionFail
  | ClearDiscussion;
