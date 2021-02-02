export const NAVBAR_SELECTED = 'NAVBAR_SELECTED';
export const NAVBAR_CLEAR = 'NAVBAR_CLEAR';

export enum SelectedType {
  Activity,
  Task,
  Discussions,
  Meeting,
  Github,
  Notes,
  Files,
}

export interface NavbarSelected {
  type: typeof NAVBAR_SELECTED;
  payload: SelectedType;
}
export interface NavbarClear {
  type: typeof NAVBAR_CLEAR;
}

export type NavbarDispatchTypes = NavbarSelected | NavbarClear;
