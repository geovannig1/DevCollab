export const DISPLAY_FULLSCREEN = 'DISPLAY_FULLSCREEN';
export const DISPLAY_CLEAR = 'DISPLAY_CLEAR';

export interface DisplayFullscreen {
  type: typeof DISPLAY_FULLSCREEN;
  payload: boolean;
}

export interface DisplayClear {
  type: typeof DISPLAY_CLEAR;
}

export type DisplayDispatchTypes = DisplayFullscreen | DisplayClear;
