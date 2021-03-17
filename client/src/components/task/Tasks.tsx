import React, { Fragment, memo } from 'react';

import Task from './Task';
import { Member } from '../../actions/taskTypes';
import { ProjectType } from '../../actions/projectTypes';

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
  selectedProject?: ProjectType;
}

const Tasks: React.FC<TasksProps> = ({
  tasks,
  columnId,
  signedInMember,
  selectedProject,
}) => {
  return (
    <Fragment>
      {tasks.map((task, index) => (
        <Task
          key={task.id}
          task={task}
          index={index}
          columnId={columnId}
          signedInMember={signedInMember}
          selectedProject={selectedProject}
        />
      ))}
    </Fragment>
  );
};

export default memo(Tasks);
