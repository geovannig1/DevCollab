export const NOTES_LOADED = 'NOTE_LOADED';
export const NOTE_CREATED = 'NOTE_CREATED';
export const NOTE_FAIL = 'NOTE_FAIL';

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

export interface NoteCreated {
  type: typeof NOTE_CREATED;
  payload: NoteTypes;
}

export interface NoteFail {
  type: typeof NOTE_FAIL;
  payload: {
    msg: string;
    status: number;
  };
}

export type NoteDispatchTypes = NotesLoaded | NoteCreated | NoteFail;
