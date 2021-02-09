import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import styled from 'styled-components';
import { Link, useParams } from 'react-router-dom';
import dayjs from 'dayjs';

import { setColor, setRem, setShadow } from '../../styles';
import VisibilityIcon from '@material-ui/icons/Visibility';
import avatar from '../../assets/profile-picture.png';
import { Member } from './taskTypes';
import Avatar from '../global/Avatar';
import AccessAlarmsIcon from '@material-ui/icons/AccessAlarms';

interface TaskProps {
  task: {
    id: string;
    title: string;
    description: string;
    members: Member[];
    dueDate: string;
  };
  index: number;
  columnId: string;
}

const Task: React.FC<TaskProps> = ({ task, index, columnId }) => {
  const { projectId } = useParams<{ projectId: string }>();

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <Container
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          isDragging={snapshot.isDragging}
        >
          <Content>
            <ContentContainer>
              <span>{task.title}</span>

              {task.dueDate && (
                <DateContainer>
                  <AccessAlarmsIcon fontSize='small' />
                  <span>{dayjs(task.dueDate).format('DD MMM YYYY')}</span>
                </DateContainer>
              )}

              <AvatarContainer>
                {task.members.map((member) => (
                  <Avatar
                    key={member.user._id}
                    src={member.user.avatar ?? avatar}
                    alt='profile'
                  />
                ))}
              </AvatarContainer>
            </ContentContainer>
            <Link
              to={`/projects/${projectId}/lists/${columnId}/tasks/${task.id}`}
            >
              <VisibilityIcon fontSize='small' />
            </Link>
          </Content>
        </Container>
      )}
    </Draggable>
  );
};

const Container = styled.div<{ isDragging: boolean }>`
  padding: 15px 8px;
  border: 2px solid ${setColor.mainGrey};
  border-radius: 6px;
  margin-bottom: 8px;
  box-shadow: ${setShadow.light};
  background-color: ${({ isDragging }) =>
    isDragging ? setColor.primaryLight : setColor.mainWhite};
  &:hover {
    transition: 0.3s ease-in-out;
    background-color: ${setColor.mainGrey};
  }
`;

const Content = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  a {
    border: none;
    background: none;
    cursor: pointer;
    transition: 0.3s ease-in-out;
    color: ${setColor.lightBlack};
    &:hover {
      color: ${setColor.mainBlack};
    }
    &:active {
      color: ${setColor.lightBlack};
    }
  }
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  span {
    font-weight: 500;
  }
`;

const AvatarContainer = styled.div`
  display: flex;
`;

const DateContainer = styled.div`
  display: flex;
  align-items: center;
  margin: 10px 0;
  background-color: ${setColor.primary};
  padding: 3px 5px;
  border-radius: 5px;
  color: ${setColor.mainWhite};
  span {
    margin: 0;
    margin-left: 5px;
    font-size: ${setRem(12)};
  }
`;

export default Task;
