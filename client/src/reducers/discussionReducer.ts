import {
  DISCUSSION_FAIL,
  DISCUSSION_CREATED,
  DISCUSSIONS_LOADED,
  DISCUSSION_LOADED,
  CLEAR_DISCUSSION,
  DiscussionDispatchTypes,
  DiscussionType,
} from '../actions/discussionTypes';

export interface DiscussionInitialState {
  discussions: DiscussionType[];
  discussionFail: object;
  selectedDiscussion?: DiscussionType;
}

const discussionInitialState: DiscussionInitialState = {
  discussions: [],
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
    case DISCUSSION_LOADED:
      return { ...state, selectedDiscussion: action.payload, discussions: [] };
    case DISCUSSION_CREATED:
      return { ...state, discussions: [action.payload, ...state.discussions] };
    case DISCUSSION_FAIL:
      return { ...state, discussionFail: action.payload };
    case CLEAR_DISCUSSION:
      return {
        discussions: [],
        discussionFail: {},
        selectedDiscussion: undefined,
      };
    default:
      return state;
  }
};

export default discussionReducer;
