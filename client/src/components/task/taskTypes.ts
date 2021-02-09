export interface Member {
  user: {
    _id: string;
    email?: string;
    avatar?: string;
  };
}

export interface Comment {
  _id: string;
  date: Date;
  user: {
    _id: string;
    email?: string;
    avatar?: string;
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
