export const PROJECTS_LOADED = 'PROJECTS_LOADED';
export const PROJECT_LOADED = 'PROJECT_LOADED';
export const PROJECT_CREATED = 'PROJECT_CREATED';
export const PROJECT_UPDATED = 'PROJECT_UPDATED';
export const PROJECT_CLEAR = 'PROJECT_CLEAR';
export const PROJECT_DELETED = 'PROJECT_DELETE';
export const PROJECT_ERROR = 'PROJECT_ERROR';

export enum AccessPermission {
  Admin,
  ReadWriteDelete,
  ReadOnly,
}

export type Member = {
  accessPermission: AccessPermission;
  user: {
    _id: number;
    firstName: string;
    lastName: string;
    email: string;
  };
};
export interface ProjectType {
  _id: number;
  name: string;
  description: string;
  members: Member[];
}

export interface ProjectsLoaded {
  type: typeof PROJECTS_LOADED;
  payload: ProjectType[];
}
export interface ProjectLoaded {
  type: typeof PROJECT_LOADED;
  payload: ProjectType;
}
export interface ProjectCreated {
  type: typeof PROJECT_CREATED;
  payload: ProjectType;
}
export interface ProjectUpdated {
  type: typeof PROJECT_UPDATED;
  payload: {
    id: string;
    project: ProjectType;
  };
}
export interface ProjectClear {
  type: typeof PROJECT_CLEAR;
}
export interface ProjectDeleted {
  type: typeof PROJECT_DELETED;
  payload: number;
}
export interface ProjectError {
  type: typeof PROJECT_ERROR;
  payload: {
    msg: string;
    status: string;
  };
}

export type ProjectDispatchTypes =
  | ProjectsLoaded
  | ProjectLoaded
  | ProjectCreated
  | ProjectUpdated
  | ProjectClear
  | ProjectDeleted
  | ProjectError;

export interface MembersData {
  email: string;
  accessPermission: AccessPermission;
}

export interface ProjectData {
  name: string;
  description: string;
  members: MembersData[];
}
