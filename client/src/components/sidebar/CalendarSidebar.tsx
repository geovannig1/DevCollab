import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Calendar, { CalendarTileProperties } from 'react-calendar';
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
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import { AuthInitialState } from '../../reducers/authReducer';
import socket from '../../utils/socketio';

export interface TaskData {
  id: string;
  title: string;
  description: string;
  members: Member[];
  dueDate: string;
}

interface CalendarSidebarProps {
  auth: AuthInitialState;
  project: ProjectInitialState;
  task: TaskInitialState;
  loadTaskState: (projectId: string) => Promise<void>;
}

const CalendarSidebar: React.FC<CalendarSidebarProps> = ({
  auth: { user },
  project: { selectedProject },
  task: { tasks },
  loadTaskState,
}) => {
  const [taskData, setTaskData] = useState<TaskData[] | undefined>();

  useEffect(() => {
    if (selectedProject) {
      loadTaskState(selectedProject._id);

      socket.emit('join project', { projectId: selectedProject._id });
      //Listen to project update and change the calendar data
      socket.on('updated update task', () => {
        loadTaskState(selectedProject?._id);
      });
    } else if (!selectedProject) {
      setTaskData(undefined);
    }

    return () => {
      socket.emit('leave project', { projectId: selectedProject?._id });
    };
  }, [selectedProject, loadTaskState]);

  //Set the task lists
  useEffect(() => {
    if (tasks) {
      setTaskData(undefined);
      Object.keys(tasks.tasks).map((key) => {
        if (
          tasks.tasks[key].members.find(
            (member) => member.user._id === user?._id
          )
        ) {
          return setTaskData((prevData) => [
            ...(prevData ?? []),
            tasks.tasks[key],
          ]);
        }
        return null;
      });
    }
  }, [tasks]);

  //Date state
  const [value, onChange] = useState<Date | Date[]>(new Date());

  //Handle the deadline tile
  const handleTileContent = (props: CalendarTileProperties) => {
    const taskDate = taskData?.map((task) =>
      dayjs(task.dueDate).format('DD/MM/YYYY')
    );
    const dates = taskDate?.filter((date) => date !== null);

    return dates?.includes(dayjs(props.date).format('DD/MM/YYYY')) ? (
      <FiberManualRecordIcon
        style={{ fontSize: setRem(9), color: setColor.mainRed }}
      />
    ) : null;
  };

  return (
    <Container>
      <StyledCalendar
        onChange={(date) => onChange(date)}
        value={value}
        calendarType='US'
        locale='en-US'
        tileContent={handleTileContent}
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
  auth: state.auth,
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
  button {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
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
