import React, { Fragment } from 'react';
import styled from 'styled-components';
import dayjs from 'dayjs';

import { setColor, setShadow } from '../../styles';
import AssignmentTurnedInIcon from '@material-ui/icons/AssignmentTurnedIn';
import { TaskData } from './CalendarSidebar';

interface TaskCardProps {
  task?: TaskData;
  date: Date | Date[];
}

const TaskCard: React.FC<TaskCardProps> = ({ task, date }) => {
  return (
    <Fragment>
      {dayjs(task?.dueDate).format('DD/MM/YYYY') ===
        dayjs(date.toString()).format('DD/MM/YYYY') && (
        <Container>
          <IconContainer>
            <AssignmentIcon fontSize='small' />
          </IconContainer>
          <span>{task?.title}</span>
        </Container>
      )}
    </Fragment>
  );
};

const Container = styled.div`
  margin: 10px 0;
  border: 1px solid ${setColor.darkGrey};
  border-radius: 8px;
  padding: 10px;
  display: flex;
  align-items: center;
  box-shadow: ${setShadow.main};
  transition: 0.2s ease-in-out;
  span {
    font-weight: 500;
  }
`;

const IconContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${setColor.primary};
  border-radius: 100%;
  min-height: 30px;
  min-width: 30px;
  margin-right: 10px;
`;

const AssignmentIcon = styled(AssignmentTurnedInIcon)`
  color: ${setColor.mainWhite};
`;

export default TaskCard;
