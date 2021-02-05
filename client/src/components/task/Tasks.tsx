import React, { Fragment, memo } from 'react';

import Task from './Task';
import { User } from './taskTypes';

interface TasksProps {
  tasks: {
    id: string;
    title: string;
    description: string;
    members: User[];
    dueDate: string;
  }[];
}

const Tasks: React.FC<TasksProps> = ({ tasks }) => {
  return (
    <Fragment>
      {tasks.map((task, index) => (
        <Task key={task.id} task={task} index={index} />
      ))}
    </Fragment>
  );
};

export default memo(Tasks);
