export const DISCUSSIONS_LOADED = 'DISCUSSIONS_LOADED';
export const DISCUSSION_LOADED = 'DISCUSSION_LOADED';
export const DISCUSSION_CREATED = 'DISCUSSION_CREATED';
export const DISCUSSION_UPDATED = 'DISCUSSION_UPDATED';
export const DISCUSSION_DELETED = 'DISCUSSION_DELETED';
export const DISCUSSION_FAIL = 'DISCUSSION_FAIL';
export const COMMENT_RECEIVED = 'COMMENT_RECEIVED';
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

export interface DiscussionUpdated {
  type: typeof DISCUSSION_UPDATED;
  payload: DiscussionType;
}

export interface DiscussionDeleted {
  type: typeof DISCUSSION_DELETED;
  payload: string;
}

export interface DiscussionFail {
  type: typeof DISCUSSION_FAIL;
  payload: { msg: string; status: number };
}

export interface ClearDiscussion {
  type: typeof CLEAR_DISCUSSION;
}

export type DiscussionDispatchTypes =
  | DiscussionsLoaded
  | DiscussionLoaded
  | DiscussionCreated
  | DiscussionUpdated
  | DiscussionDeleted
  | CommentReceived
  | DiscussionFail
  | ClearDiscussion;
