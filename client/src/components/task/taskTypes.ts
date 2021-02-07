interface Members {
  user: {
    _id: string;
    email?: string;
    avatar?: string;
  };
}

export interface TaskData {
  title: string;
  description: string;
  members: Members[];
  dueDate?: string;
}

export interface User {
  email: string;
  avatar: string;
}

export interface InitialTaskState {
  tasks: {
    [taskName: string]: {
      id: string;
      title: string;
      description: string;
      members: User[];
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
