import React, { Fragment, memo } from 'react';

import Task from './Task';
import { Member } from '../../actions/taskTypes';

interface TasksProps {
  tasks: {
    id: string;
    title: string;
    description: string;
    members: Member[];
    dueDate: string;
    comments?: Comment[];
  }[];
  columnId: string;
  signedInMember?: Member;
}

const Tasks: React.FC<TasksProps> = ({ tasks, columnId, signedInMember }) => {
  return (
    <Fragment>
      {tasks.map((task, index) => (
        <Task
          key={task.id}
          task={task}
          index={index}
          columnId={columnId}
          signedInMember={signedInMember}
        />
      ))}
    </Fragment>
  );
};

export default memo(Tasks);
