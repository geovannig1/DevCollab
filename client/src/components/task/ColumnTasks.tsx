import React, { memo } from 'react';

import Column from './Column';
import { Member } from '../../components/task/taskTypes';

interface ColumnTasksProps {
  column: {
    id: string;
    title: string;
    taskIds: string[];
  };
  taskMap: {
    [taskName: string]: {
      id: string;
      title: string;
      description: string;
      members: Member[];
      dueDate: string;
    };
  };
  index: number;
}

const ColumnTasks: React.FC<ColumnTasksProps> = ({
  column,
  taskMap,
  index,
}) => {
  const tasks = column.taskIds.map((taskId) => taskMap[taskId]);
  return <Column column={column} tasks={tasks} index={index} />;
};

export default memo(ColumnTasks);
