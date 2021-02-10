import {
  DISCUSSION_FAIL,
  DISCUSSION_CREATED,
  DISCUSSION_LOADED,
  DiscussionDispatchTypes,
  DiscussionType,
} from '../actions/discussionTypes';

export interface DiscussionInitialState {
  discussions: DiscussionType[];
  discussionFail: object;
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
    case DISCUSSION_LOADED:
      return { ...state, discussions: action.payload };
    case DISCUSSION_CREATED:
      return { ...state, discussions: [...state.discussions, action.payload] };
    case DISCUSSION_FAIL:
      return { ...state, discussionFail: action.payload };
    default:
      return state;
  }
};

export default discussionReducer;
