import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import dayjs from 'dayjs';
import { connect } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';

import { setColor, setRem } from '../../styles';
import TaskCard from './TaskCard';
import { Store } from '../../store';
import { ProjectInitialState } from '../../reducers/projectReducer';
import { loadTaskState } from '../../actions/taskActions';
import { TaskInitialState } from '../../reducers/taskReducer';
import { Member } from '../../actions/taskTypes';

export interface TaskData {
  id: string;
  title: string;
  description: string;
  members: Member[];
  dueDate: string;
}

interface CalendarSidebarProps {
  project: ProjectInitialState;
  task: TaskInitialState;
  loadTaskState: (projectId: string) => Promise<void>;
}

const CalendarSidebar: React.FC<CalendarSidebarProps> = ({
  project: { selectedProject },
  task: { tasks },
  loadTaskState,
}) => {
  const [taskData, setTaskData] = useState<TaskData[] | undefined>();

  useEffect(() => {
    if (selectedProject) {
      loadTaskState(selectedProject._id);
    }
  }, [selectedProject, loadTaskState]);

  useEffect(() => {
    if (tasks) {
      !taskData &&
        Object.keys(tasks.tasks).map((key) =>
          setTaskData((prevData) => [...(prevData ?? []), tasks.tasks[key]])
        );
    }
  }, [tasks]);

  //Date state
  const [value, onChange] = useState<Date | Date[]>(new Date());

  const handleTile = () => {
    const taskDate = taskData?.map(
      (task) =>
        dayjs(task?.dueDate).format('DD/MM/YYYY') ===
        dayjs(value.toString()).format('DD/MM/YYYY')
    );

    return <div>wew</div>;
  };

  return (
    <Container>
      <StyledCalendar
        onChange={(date) => onChange(date)}
        value={value}
        calendarType='US'
        locale='en-US'
        tileContent={({ activeStartDate, date }) => {
          const test = taskData?.map((task) =>
            dayjs(task?.dueDate).format('DD/MM/YYYY') ===
            dayjs(date).format('DD/MM/YYYY') ? (
              <div>wew</div>
            ) : null
          );
          console.log(taskData);

          return <div />;
        }}
      />
      <EventContainer>
        <span>Task Lists</span> {dayjs(value.toString()).format('D MMMM YYYY')}
      </EventContainer>

      {taskData?.map((task) => (
        <TaskCard key={task.id} task={task} date={value} />
      ))}
    </Container>
  );
};

const mapStateToProps = (state: Store) => ({
  project: state.project,
  task: state.task,
});

const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, AnyAction>) => ({
  loadTaskState: (projectId: string) => dispatch(loadTaskState(projectId)),
});

const Container = styled.div`
  margin: 0 35px;
`;

const StyledCalendar = styled(Calendar)`
  margin: 25px 0;
  border: 2px solid ${setColor.primaryDark};
  border-radius: 8px;
  abbr {
    text-decoration: none;
  }
  span {
    color: ${setColor.primaryDark};
  }
`;

const EventContainer = styled.div`
  font-weight: 400;
  font-size: ${setRem()};
  color: ${setColor.mediumBlack};
  span {
    font-size: ${setRem(18)};
    font-weight: 600;
    color: ${setColor.primary};
  }
`;

export default connect(mapStateToProps, mapDispatchToProps)(CalendarSidebar);
