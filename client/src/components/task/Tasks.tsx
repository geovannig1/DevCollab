import React, { Fragment, memo } from 'react';

import Task from './Task';

interface TasksProps {
  tasks: {
    id: string;
    content: string;
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
