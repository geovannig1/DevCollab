import { Dispatch } from 'redux';

import {
  DISPLAY_CLEAR,
  DISPLAY_FULLSCREEN,
  DisplayDispatchTypes,
} from './displayTypes';

export const setFullscreen = (fullscreen: boolean) => (
  dispatch: Dispatch<DisplayDispatchTypes>
) => {
  dispatch({ type: DISPLAY_FULLSCREEN, payload: fullscreen });
};

export const clearFullscreen = () => (
  dispatch: Dispatch<DisplayDispatchTypes>
) => {
  dispatch({ type: DISPLAY_CLEAR });
};
