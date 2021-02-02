import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import styled from 'styled-components';
import { useParams, useHistory } from 'react-router-dom';
import { DragDropContext, DropResult, Droppable } from 'react-beautiful-dnd';

import { setColor } from '../styles';
import { loadProject } from '../actions/projectActions';
import { setNavbar, clearNavbar } from '../actions/navbarAction';
import { SelectedType } from '../actions/navbarTypes';
import { Store } from '../store';
import { ProjectInitialState } from '../reducers/projectReducer';
import ColumnTasks from '../components/task/ColumnTasks';

import InitialData from './initialData';

interface TaskProps {
  setNavbar: (selected: SelectedType) => void;
  loadProject: (projectId: string) => Promise<void>;
  clearNavbar: () => void;
  project: ProjectInitialState;
}

const Task: React.FC<TaskProps> = ({
  setNavbar,
  clearNavbar,
  loadProject,
  project: { selectedProject, projectError },
}) => {
  const { projectId } = useParams<{ projectId: string }>();
  const history = useHistory();

  useEffect(() => {
    document.title = 'Tasks | DevCollab';
    !selectedProject && loadProject(projectId);
    projectError && history.push('/projects');

    setNavbar(SelectedType.Task);
    return () => clearNavbar();
  }, [
    setNavbar,
    clearNavbar,
    history,
    loadProject,
    projectError,
    projectId,
    selectedProject,
  ]);

  //State for the task
  const [taskState, setTaskState] = useState(InitialData);

  const onDragEnd = (result: DropResult) => {
    const { destination, draggableId, source, type } = result;
    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    //Move column
    if (type === 'column') {
      const newColumnOrder = [...taskState.columnOrder];
      newColumnOrder.splice(source.index, 1);
      newColumnOrder.splice(destination.index, 0, draggableId);

      setTaskState({
        ...taskState,
        columnOrder: newColumnOrder,
      });
      return;
    }

    const start = taskState.columns[source.droppableId];
    const finish = taskState.columns[destination.droppableId];

    //Move task in the same column
    if (start === finish) {
      const newTaskIds = [...start.taskIds];
      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, draggableId);

      const newColumn = {
        ...start,
        taskIds: newTaskIds,
      };

      const newState = {
        ...taskState,
        columns: {
          ...taskState.columns,
          [newColumn.id]: newColumn,
        },
      };

      setTaskState(newState);
      return;
    }

    //Move task to another column
    const startTaskIds = [...start.taskIds];
    startTaskIds.splice(source.index, 1);
    const newStart = {
      ...start,
      taskIds: startTaskIds,
    };

    const finishTaskIds = [...finish.taskIds];
    finishTaskIds.splice(destination.index, 0, draggableId);
    const newFinish = {
      ...finish,
      taskIds: finishTaskIds,
    };

    const newState = {
      ...taskState,
      columns: {
        ...taskState.columns,
        [newStart.id]: newStart,
        [newFinish.id]: newFinish,
      },
    };

    setTaskState(newState);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId='all-columns' direction='horizontal' type='column'>
        {(provided) => (
          <Container {...provided.droppableProps} ref={provided.innerRef}>
            {taskState.columnOrder.map((columnId, index) => {
              const column = taskState.columns[columnId];
              return (
                <ColumnTasks
                  key={column.id}
                  column={column}
                  taskMap={taskState.tasks}
                  index={index}
                />
              );
            })}
            {provided.placeholder}
          </Container>
        )}
      </Droppable>
    </DragDropContext>
  );
};

const mapStateToProps = (state: Store) => ({
  project: state.project,
});

const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, AnyAction>) => ({
  setNavbar: (selected: SelectedType) => dispatch(setNavbar(selected)),
  clearNavbar: () => dispatch(clearNavbar()),
  loadProject: (projectId: string) => dispatch(loadProject(projectId)),
});

const Container = styled.div`
  display: flex;
  margin-top: 30px;
  min-width: 100%;
`;

export default connect(mapStateToProps, mapDispatchToProps)(Task);
