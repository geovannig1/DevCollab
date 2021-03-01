import {
  FILES_LOADED,
  FILE_LOADED,
  FILE_CREATED,
  FILE_DELETED,
  FILE_FAIL,
  CLEAR_FILE,
  CLEAR_SELECTED_FILE,
  FileDispatchTypes,
  FileTypes,
  FILE_UPDATED,
} from '../actions/fileTypes';

export interface FileInitialState {
  files?: FileTypes[];
  selectedFile?: FileTypes;
  fileError?: { msg: string; status: number };
}

const fileInitialState: FileInitialState = {};

const fileReducer = (
  state = fileInitialState,
  action: FileDispatchTypes
): FileInitialState => {
  switch (action.type) {
    case FILES_LOADED:
      return { ...state, files: action.payload, selectedFile: undefined };
    case FILE_LOADED:
      return { ...state, selectedFile: action.payload };
    case FILE_CREATED:
      return { ...state, files: [action.payload, ...(state.files ?? [])] };
    case FILE_UPDATED:
      return {
        ...state,
        files: state.files?.map((file) =>
          file._id === action.payload._id ? action.payload : file
        ),
      };
    case FILE_DELETED:
      return {
        ...state,
        files: state.files?.filter((file) => file._id !== action.payload),
      };
    case FILE_FAIL:
      return { ...state, fileError: action.payload };
    case CLEAR_FILE:
      return {
        fileError: undefined,
        files: undefined,
        selectedFile: undefined,
      };
    case CLEAR_SELECTED_FILE:
      return { ...state, selectedFile: undefined };
    default:
      return state;
  }
};

export default fileReducer;
