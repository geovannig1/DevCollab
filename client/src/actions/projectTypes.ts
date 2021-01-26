export const PROJECT_LOADED = 'PROJECT_LOADED';
export const PROJECT_CLEAR = 'PROJECT_CLEAR';

export enum AccessPermission {
  Admin,
  ReadWriteDelete,
  ReadOnly,
}

export type Member = {
  user: {
    firstName: string;
    lastName: string;
    email: string;
    accessPermission: AccessPermission;
  };
};
export interface ProjectType extends Array<ProjectType> {
  _id: number;
  name: string;
  description: string;
  members: Member[];
}

export interface ProjectLoaded {
  type: typeof PROJECT_LOADED;
  payload: ProjectType;
}
export interface ProjectClear {
  type: typeof PROJECT_CLEAR;
}

export type ProjectDispatchTypes = ProjectLoaded | ProjectClear;

export interface MembersData {
  email: string;
  accessPermission: AccessPermission;
}

export interface CreateProjectData {
  name: string;
  description: string;
  members: MembersData[];
}
