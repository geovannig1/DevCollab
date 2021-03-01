export const FILES_LOADED = 'FILES_LOADED';
export const FILE_LOADED = 'FILE_LOADED';
export const FILE_CREATED = 'FILE_CREATED';
export const FILE_UPDATED = 'FILE_UPDATED';
export const FILE_DELETED = 'FILE_DELETED';
export const FILE_FAIL = 'FILE_FAIL';
export const CLEAR_FILE = 'CLEAR_FILE';
export const CLEAR_SELECTED_FILE = 'CLEAR_SELECTED_FILE ';

export interface FileTypes {
  _id?: string;
  name: string;
  file: {
    url: string;
  };
  user?: {
    firstName: string;
    lastName: string;
  };
  date?: Date;
}

export interface FilesLoaded {
  type: typeof FILES_LOADED;
  payload: FileTypes[];
}

export interface FileLoaded {
  type: typeof FILE_LOADED;
  payload: FileTypes;
}

export interface FileCreated {
  type: typeof FILE_CREATED;
  payload: FileTypes;
}

export interface FileUpdated {
  type: typeof FILE_UPDATED;
  payload: FileTypes;
}

export interface FileDeleted {
  type: typeof FILE_DELETED;
  payload: string;
}

export interface FileFail {
  type: typeof FILE_FAIL;
  payload: { msg: string; status: number };
}

export interface ClearFile {
  type: typeof CLEAR_FILE;
}

export interface ClearSelectedFile {
  type: typeof CLEAR_SELECTED_FILE;
}

export type FileDispatchTypes =
  | FilesLoaded
  | FileLoaded
  | FileCreated
  | FileUpdated
  | FileDeleted
  | FileFail
  | ClearFile
  | ClearSelectedFile;
