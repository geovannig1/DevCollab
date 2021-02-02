interface InitialData {
  tasks: {
    [taskName: string]: {
      id: string;
      content: string;
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

const initialData: InitialData = {
  tasks: {
    'task-1': { id: 'task-1', content: 'hello-1' },
    'task-2': { id: 'task-2', content: 'hello-2' },
    'task-3': { id: 'task-3', content: 'hello-3' },
    'task-4': { id: 'task-4', content: 'hello-4' },
  },
  columns: {
    'column-1': {
      id: 'column-1',
      title: 'To Do',
      taskIds: ['task-1', 'task-2', 'task-3', 'task-4'],
    },
    'column-2': {
      id: 'column-2',
      title: 'In progress',
      taskIds: [],
    },
    'column-3': {
      id: 'column-3',
      title: 'Done',
      taskIds: [],
    },
  },
  // Facilitate reordering of the columns
  columnOrder: ['column-1', 'column-2', 'column-3'],
};

export default initialData;
