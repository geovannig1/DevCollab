export const NOTES_LOADED = 'NOTES_LOADED';
export const NOTE_LOADED = 'NOTE_LOADED';
export const NOTE_CREATED = 'NOTE_CREATED';
export const NOTE_UPDATED = 'NOTE_UPDATED';
export const NOTE_DELETED = 'NOTE_DELETED';
export const NOTE_FAIL = 'NOTE_FAIL';
export const CLEAR_NOTE = 'CLEAR_NOTE';
export const CLEAR_SELECTED_NOTE = 'CLEAR_SELECTED_NOTE';

export interface NoteTypes {
  _id?: string;
  user?: {
    firstName: string;
    lastName: string;
  };
  date?: Date;
  title: string;
  contents: string;
}

export interface NotesLoaded {
  type: typeof NOTES_LOADED;
  payload: NoteTypes[];
}

export interface NoteLoaded {
  type: typeof NOTE_LOADED;
  payload: NoteTypes;
}

export interface NoteCreated {
  type: typeof NOTE_CREATED;
  payload: NoteTypes;
}

export interface NoteUpdated {
  type: typeof NOTE_UPDATED;
  payload: NoteTypes;
}

export interface NoteDeleted {
  type: typeof NOTE_DELETED;
  payload: string;
}

export interface NoteFail {
  type: typeof NOTE_FAIL;
  payload: {
    msg: string;
    status: number;
  };
}

export interface ClearNote {
  type: typeof CLEAR_NOTE;
}

export interface ClearSelectedNote {
  type: typeof CLEAR_SELECTED_NOTE;
}

export type NoteDispatchTypes =
  | NotesLoaded
  | NoteLoaded
  | NoteUpdated
  | NoteCreated
  | NoteDeleted
  | NoteFail
  | ClearNote
  | ClearSelectedNote;
