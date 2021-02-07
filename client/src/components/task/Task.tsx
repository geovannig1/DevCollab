import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import styled from 'styled-components';
import { Link, useParams } from 'react-router-dom';

import { setColor, setShadow } from '../../styles';
import VisibilityIcon from '@material-ui/icons/Visibility';
import dummy from '../../assets/profile-picture.png';
import { User } from './taskTypes';
import Avatar from '../global/Avatar';

interface TaskProps {
  task: {
    id: string;
    title: string;
    description: string;
    members: User[];
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
              <Avatar src={dummy} alt='profile' />
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
    margin-bottom: 10px;
  }
`;

export default Task;
