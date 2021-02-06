import React from 'react';
import styled from 'styled-components';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import { Store } from '../../store';
import { setColor, setShadow } from '../../styles';
import Tasks from './Tasks';
import AddIcon from '@material-ui/icons/Add';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import { ProjectInitialState } from '../../reducers/projectReducer';
import { User } from './taskTypes';
import CardMenu from '../../components/global/CardMenu';
import socket from '../../utils/socketio';

interface ColumnProps {
  column: {
    id: string;
    title: string;
    taskIds: string[];
  };
  tasks: {
    id: string;
    title: string;
    description: string;
    members: User[];
    dueDate: string;
  }[];
  index: number;
  project: ProjectInitialState;
}

const Column: React.FC<ColumnProps> = ({
  column,
  tasks,
  index,
  project: { selectedProject },
}) => {
  const handleDelete = () => {
    socket.emit('delete list', {
      columnId: column.id,
      projectId: selectedProject?._id,
      tasks: tasks,
    });
  };

  return (
    <Draggable draggableId={column.id} index={index}>
      {(provided) => (
        <Container {...provided.draggableProps} ref={provided.innerRef}>
          <Header {...provided.dragHandleProps}>
            <Title>{column.title}</Title>
            <CardMenu
              deleteTitle='Delete List'
              deleteText={`Are you sure want to delete ${column.title} list? this process can't be undone.`}
              deleteItem={handleDelete}
              listTitle={column.title}
              listId={column.id}
            >
              <HorizIcon fontSize='large' />
            </CardMenu>
          </Header>
          <Droppable droppableId={column.id} type='task'>
            {(provided, snapshot) => (
              <TaskList
                {...provided.droppableProps}
                ref={provided.innerRef}
                isDraggingOver={snapshot.isDraggingOver}
              >
                <Tasks tasks={tasks} columnId={column.id} />
                {provided.placeholder}
                <StyledLink
                  to={`/projects/${selectedProject?._id}/create-task/${column.id}`}
                >
                  <AddIcon />
                  Add task
                </StyledLink>
              </TaskList>
            )}
          </Droppable>
        </Container>
      )}
    </Draggable>
  );
};

const mapStateToProps = (state: Store) => ({
  project: state.project,
});

const Container = styled.div`
  display: inline-table;
  width: 250px;
  height: 100px;
  margin-right: 50px;
  box-shadow: ${setShadow.main};
  user-select: none;
  border-radius: 8px;
  background-color: ${setColor.mainWhite};
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 5px 10px;
`;

const Title = styled.h4`
  padding: 8px;
  font-weight: 600;
`;

const HorizIcon = styled(MoreHorizIcon)`
  color: ${setColor.lightBlack};
  cursor: pointer;
  &:hover {
    transition: 0.2s ease-in-out;
    color: ${setColor.mainBlack};
  }
  &:active {
    color: ${setColor.lightBlack};
  }
`;

const TaskList = styled.div<{ isDraggingOver: boolean }>`
  padding: 8px;
  border-radius: 8px;
  transition: 0.2s ease-in-out;
  background-color: ${({ isDraggingOver }) =>
    isDraggingOver ? setColor.primaryTransparent : setColor.mainWhite};
  flex-grow: 1;
  min-height: 100px;
`;

const StyledLink = styled(Link)`
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 500;
  width: 100%;
  cursor: pointer;
  border: none;
  outline: none;
  padding: 5px 0;
  text-decoration: none;
  background-color: ${setColor.secondary};
  color: ${setColor.mainWhite};
  border-radius: 10px;
  transition: 0.3s ease-in-out;
  &:hover {
    background-color: ${setColor.secondaryDark};
  }
  &:active {
    background-color: ${setColor.secondary};
  }
`;

export default connect(mapStateToProps)(Column);
