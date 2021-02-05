import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import styled from 'styled-components';

import { setColor, setShadow } from '../../styles';
import VisibilityIcon from '@material-ui/icons/Visibility';
import dummy from '../../assets/profile-picture.png';
import { User } from './taskTypes';

interface TaskProps {
  task: {
    id: string;
    title: string;
    description: string;
    members: User[];
    dueDate: string;
  };
  index: number;
}

const Task: React.FC<TaskProps> = ({ task, index }) => {
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
              <img src={dummy} alt='' />
            </ContentContainer>
            <button>
              <VisibilityIcon fontSize='small' />
            </button>
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
  button {
    border: none;
    background: none;
    cursor: pointer;
    transition: 0.3s ease-in-out;
    color: ${setColor.lightBlack};
    &:hover {
      color: ${setColor.mainBlack};
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
  img {
    height: 30px;
    width: 30px;
    border-radius: 100%;
    object-fit: cover;
  }
`;

export default Task;
