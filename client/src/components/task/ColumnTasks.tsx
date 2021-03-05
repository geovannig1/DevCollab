import React, { memo } from 'react';

import Column from './Column';
import { Member } from '../../actions/taskTypes';

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
      comments?: Comment[];
    };
  };
  index: number;
  signedInMember?: Member;
}

const ColumnTasks: React.FC<ColumnTasksProps> = ({
  column,
  taskMap,
  index,
  signedInMember,
}) => {
  const tasks = column.taskIds.map((taskId) => taskMap[taskId]);
  return (
    <Column
      column={column}
      tasks={tasks}
      index={index}
      signedInMember={signedInMember}
    />
  );
};

export default memo(ColumnTasks);
