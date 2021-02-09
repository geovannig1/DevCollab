import React, { Fragment, memo } from 'react';

import Task from './Task';
import { Member } from './taskTypes';

interface TasksProps {
  tasks: {
    id: string;
    title: string;
    description: string;
    members: Member[];
    dueDate: string;
  }[];
  columnId: string;
}

const Tasks: React.FC<TasksProps> = ({ tasks, columnId }) => {
  return (
    <Fragment>
      {tasks.map((task, index) => (
        <Task key={task.id} task={task} index={index} columnId={columnId} />
      ))}
    </Fragment>
  );
};

export default memo(Tasks);
