import {
  DISPLAY_CLEAR,
  DISPLAY_FULLSCREEN,
  DisplayDispatchTypes,
} from '../actions/displayTypes';

export interface DisplayInitialState {
  fullscreen: boolean;
}

const displayInitialState: DisplayInitialState = { fullscreen: false };

const displayReducer = (
  state = displayInitialState,
  action: DisplayDispatchTypes
): DisplayInitialState => {
  switch (action.type) {
    case DISPLAY_FULLSCREEN:
      return { ...state, fullscreen: action.payload };
    case DISPLAY_CLEAR:
      return { ...state, fullscreen: false };
    default:
      return state;
  }
};

export default displayReducer;
