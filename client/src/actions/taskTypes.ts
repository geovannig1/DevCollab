import { AccessPermission } from './projectTypes';

export const TASKSTATE_LOADED = 'TASKSTATE_LOADED';
export const TASK_FAIL = 'TASK_FAIL';
export const CLEAR_TASK = 'CLEAR_TASK';

export interface Member {
  user: {
    _id: string;
    email?: string;
    avatar?: {
      url: string;
    };
  };
  accessPermission?: AccessPermission;
}

export interface Comment {
  _id: string;
  date: Date;
  user: {
    _id: string;
    email?: string;
    avatar?: {
      url: string;
    };
  };
  comment: string;
}

export interface TaskData {
  title: string;
  description: string;
  members: Member[];
  dueDate?: string;
  comments?: Comment[];
}

export interface InitialTaskState {
  tasks: {
    [taskName: string]: {
      id: string;
      title: string;
      description: string;
      members: Member[];
      dueDate: string;
    };
  };
  columns: {
    [columnName: string]: {
      id: string;
      title: string;
      taskIds: string[];
    };
  };
  columnOrder: string[];
}

export interface TaskstateLoaded {
  type: typeof TASKSTATE_LOADED;
  payload: InitialTaskState;
}

export interface TaskFail {
  type: typeof TASK_FAIL;
  payload: { msg: string; status: number };
}

export interface ClearTask {
  type: typeof CLEAR_TASK;
}

export type TaskDispatchTypes = TaskstateLoaded | TaskFail | ClearTask;
