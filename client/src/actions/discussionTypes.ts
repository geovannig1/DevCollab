export const DISCUSSION_LOADED = 'DISCUSSION_LOADED';
export const DISCUSSION_CREATED = 'DISCUSSION_CREATED';
export const DISCUSSION_FAIL = 'DISCUSSION_FAIL';

export interface DiscussionType {
  _id?: string;
  title: string;
  description: string;
  attachment?: string;
}

export interface DiscussionLoaded {
  type: typeof DISCUSSION_LOADED;
  payload: DiscussionType[];
}

export interface DiscussionCreated {
  type: typeof DISCUSSION_CREATED;
  payload: DiscussionType;
}

export interface DiscussionFail {
  type: typeof DISCUSSION_FAIL;
  payload: { msg: string; status: string };
}

export type DiscussionDispatchTypes =
  | DiscussionLoaded
  | DiscussionCreated
  | DiscussionFail;
