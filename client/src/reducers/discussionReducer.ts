import {
  DISCUSSION_FAIL,
  DISCUSSION_CREATED,
  DISCUSSIONS_LOADED,
  DISCUSSION_LOADED,
  DISCUSSION_UPDATED,
  DISCUSSION_DELETED,
  COMMENT_RECEIVED,
  CLEAR_DISCUSSION,
  DiscussionDispatchTypes,
  DiscussionType,
} from '../actions/discussionTypes';

export interface DiscussionInitialState {
  discussions?: DiscussionType[];
  selectedDiscussion?: DiscussionType;
  discussionFail: object;
}

const discussionInitialState: DiscussionInitialState = {
  discussionFail: {},
};

const discussionReducer = (
  state = discussionInitialState,
  action: DiscussionDispatchTypes
): DiscussionInitialState => {
  switch (action.type) {
    case DISCUSSIONS_LOADED:
      return {
        ...state,
        discussions: action.payload,
        selectedDiscussion: undefined,
      };
    case COMMENT_RECEIVED:
    case DISCUSSION_LOADED:
      return {
        ...state,
        selectedDiscussion: action.payload,
        discussions: undefined,
      };
    case DISCUSSION_CREATED:
      return {
        ...state,
        discussions: [action.payload, ...(state.discussions ?? [])],
      };
    case DISCUSSION_UPDATED:
      return {
        ...state,
        discussions: state.discussions?.map((discussion) =>
          discussion._id === action.payload._id ? action.payload : discussion
        ),
      };
    case DISCUSSION_DELETED:
      return {
        ...state,
        discussions: state.discussions?.filter(
          (discussion) => discussion._id !== action.payload
        ),
      };
    case DISCUSSION_FAIL:
      return { ...state, discussionFail: action.payload };
    case CLEAR_DISCUSSION:
      return {
        discussions: undefined,
        discussionFail: {},
        selectedDiscussion: undefined,
      };
    default:
      return state;
  }
};

export default discussionReducer;
