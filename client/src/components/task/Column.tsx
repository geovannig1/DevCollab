import React from 'react';
import styled from 'styled-components';
import { Droppable, Draggable } from 'react-beautiful-dnd';

import { setColor, setShadow } from '../../styles';
import Tasks from './Tasks';

interface ColumnProps {
  column: {
    id: string;
    title: string;
    taskIds: string[];
  };
  tasks: {
    id: string;
    content: string;
  }[];
  index: number;
}

const Column: React.FC<ColumnProps> = ({ column, tasks, index }) => {
  return (
    <Draggable draggableId={column.id} index={index}>
      {(provided) => (
        <Container {...provided.draggableProps} ref={provided.innerRef}>
          <Title {...provided.dragHandleProps}>{column.title}</Title>
          <Droppable droppableId={column.id} type='task'>
            {(provided, snapshot) => (
              <TaskList
                {...provided.droppableProps}
                ref={provided.innerRef}
                isDraggingOver={snapshot.isDraggingOver}
              >
                <Tasks tasks={tasks} />
                {provided.placeholder}
              </TaskList>
            )}
          </Droppable>
        </Container>
      )}
    </Draggable>
  );
};

const Container = styled.div`
  width: 250px;
  height: 300px;
  margin-right: 50px;
  box-shadow: ${setShadow.main};
  user-select: none;
  border-radius: 8px;
  background-color: ${setColor.mainWhite};
`;

const Title = styled.h3`
  padding: 8px;
`;

const TaskList = styled.div<{ isDraggingOver: boolean }>`
  padding: 8px;
  transition: 0.2s ease-in-out;
  background-color: ${(props) =>
    props.isDraggingOver ? 'lightgrey' : 'white'};
  flex-grow: 1;
  min-height: 100px;
`;

export default Column;
