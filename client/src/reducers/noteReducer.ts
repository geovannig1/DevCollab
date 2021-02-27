import {
  NOTES_LOADED,
  NOTE_CREATED,
  NOTE_FAIL,
  NoteDispatchTypes,
  NoteTypes,
} from '../actions/noteTypes';

export interface NoteInitialState {
  notes?: NoteTypes[];
  selectedNote?: NoteTypes;
  noteError?: { msg: string; status: number };
}

const noteInitialState: NoteInitialState = {};

const noteReducer = (
  state = noteInitialState,
  action: NoteDispatchTypes
): NoteInitialState => {
  switch (action.type) {
    case NOTES_LOADED:
      return { ...state, notes: action.payload };
    case NOTE_CREATED:
      return { ...state, notes: [action.payload, ...(state.notes ?? [])] };
    case NOTE_FAIL:
      return { ...state, noteError: action.payload };
    default:
      return state;
  }
};

export default noteReducer;
