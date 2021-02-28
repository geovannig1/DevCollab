import {
  NOTES_LOADED,
  NOTE_LOADED,
  NOTE_CREATED,
  NOTE_UPDATED,
  NOTE_DELETED,
  NOTE_FAIL,
  CLEAR_SELECTED_NOTE,
  NoteDispatchTypes,
  NoteTypes,
  CLEAR_NOTE,
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
      return { ...state, notes: action.payload, selectedNote: undefined };
    case NOTE_LOADED:
      return { ...state, selectedNote: action.payload };
    case NOTE_CREATED:
      return { ...state, notes: [action.payload, ...(state.notes ?? [])] };
    case NOTE_UPDATED:
      return {
        ...state,
        notes: state.notes?.map((note) =>
          note._id === action.payload._id ? action.payload : note
        ),
      };
    case NOTE_DELETED:
      return {
        ...state,
        notes: state.notes?.filter((note) => note._id !== action.payload),
      };
    case NOTE_FAIL:
      return { ...state, noteError: action.payload };
    case CLEAR_NOTE:
      return {
        ...state,
        notes: undefined,
        selectedNote: undefined,
        noteError: undefined,
      };
    case CLEAR_SELECTED_NOTE:
      return {
        ...state,
        selectedNote: undefined,
      };
    default:
      return state;
  }
};

export default noteReducer;
