import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import styled from 'styled-components';
import { useParams, Redirect, useLocation } from 'react-router-dom';
import { DragDropContext, DropResult, Droppable } from 'react-beautiful-dnd';

import { loadProject } from '../actions/projectActions';
import { setNavbar, clearNavbar } from '../actions/navbarAction';
import { SelectedType } from '../actions/navbarTypes';
import { Store } from '../store';
import { ProjectInitialState } from '../reducers/projectReducer';
import ColumnTasks from '../components/task/ColumnTasks';
import AddIcon from '@material-ui/icons/Add';
import { InitialTaskState } from '../actions/taskTypes';
import { loadTaskState } from '../actions/taskActions';
import { setColor } from '../styles';
import AddListMenu from '../components/task/AddListMenu';
import socket from '../utils/socketio';
import api from '../api';
import { AuthInitialState } from '../reducers/authReducer';
import { AccessPermission } from '../actions/projectTypes';

interface TaskProps {
  setNavbar: (selected: SelectedType) => void;
  loadProject: (projectId: string) => Promise<void>;
  loadTaskState: (projectId: string) => Promise<void>;
  clearNavbar: () => void;
  project: ProjectInitialState;
  auth: AuthInitialState;
}

const Task: React.FC<TaskProps> = ({
  setNavbar,
  clearNavbar,
  loadProject,
  loadTaskState,
  project: { selectedProject, projectError },
  auth: { user },
}) => {
  const { projectId } = useParams<{ projectId: string }>();
  const location = useLocation<{
    fromCreateTask?: boolean;
    createTaskProgress?: boolean;
  }>();

  useEffect(() => {
    document.title = 'Tasks | DevCollab';
    !selectedProject && loadProject(projectId);
    projectError && <Redirect to='/projects' />;

    setNavbar(SelectedType.Task);
    return () => clearNavbar();
  }, [
    setNavbar,
    clearNavbar,
    loadProject,
    projectError,
    projectId,
    selectedProject,
  ]);

  //State for the task
  const [taskState, setTaskState] = useState<InitialTaskState>({
    columnOrder: [],
    columns: {},
    tasks: {},
  });

  //State for progress cursor
  const [progress, setProgress] = useState(true);

  //Get project tasks
  useEffect(() => {
    if (location.state?.createTaskProgress)
      setProgress(location.state.createTaskProgress);

    (async () => {
      if (selectedProject && !location.state?.fromCreateTask) {
        setProgress(true);

        const res = await api.get(`/projects/${selectedProject._id}/tasks`);
        loadTaskState(selectedProject._id);

        setProgress(false);
        if (res.data) {
          setTaskState(res.data);
        }
      }
    })();

    return () => {
      if (location.state?.fromCreateTask) location.state.fromCreateTask = false;
    };
  }, [selectedProject, location, loadTaskState]);

  //Socket connection
  useEffect(() => {
    //Listen to updated new list
    socket.on('new list update', (data: InitialTaskState) => {
      setTaskState(data);
      setProgress(false);
    });

    //Listen to updated new task
    socket.on('new task update', (data: InitialTaskState) => {
      setTaskState(data);
      setProgress(false);
      if (location.state?.createTaskProgress)
        location.state.createTaskProgress = false;
    });

    //Listen to updated column move
    socket.on('move column update', (data: InitialTaskState) => {
      setTaskState(data);
    });

    //Listen to updated move task in the same column
    socket.on('move task same column update', (data: InitialTaskState) => {
      setTaskState(data);
    });

    //Listen to updated move task in another column
    socket.on('move task another column update', (data: InitialTaskState) => {
      setTaskState(data);
    });

    //Listen to updated deleted list
    socket.on('update delete list', (data: InitialTaskState) => {
      setTaskState(data);
    });

    //Listen to updated list
    socket.on('updated update list', (data: InitialTaskState) => {
      setTaskState(data);
    });

    //Listen to updated task
    socket.on('updated update task', (data: InitialTaskState) => {
      setTaskState(data);
    });

    //Listen to updated deleted task
    socket.on('updated delete task', (data: InitialTaskState) => {
      setTaskState(data);
    });

    return () => {
      setTaskState({ tasks: {}, columns: {}, columnOrder: [] });
    };
  }, [selectedProject, location.state]);

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

      socket.emit('move column', {
        projectId: selectedProject?._id,
        columnOrder: newColumnOrder,
      });

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

      socket.emit('move task same column', {
        projectId: selectedProject?._id,
        newColumn,
      });
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

    socket.emit('move task another column', {
      projectId: selectedProject?._id,
      columnStart: newStart,
      columnFinish: newFinish,
    });
    setTaskState(newState);

    //Send activity report move task to another column
    socket.emit('move activity task', {
      projectId,
      userName: `${user?.firstName} ${user?.lastName}`,
      taskId: draggableId,
      sourceListName: newStart.title,
      destionationListName: newFinish.title,
      userId: user?._id,
    });
  };

  //Get the signed in user data
  const signedInMember = selectedProject?.members.filter(
    (member) => member.user._id === user?._id
  )[0];

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId='all-columns' direction='horizontal' type='column'>
        {(provided) => (
          <Container
            cursorProgress={progress}
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            {taskState.columnOrder.map((columnId, index) => {
              const column = taskState.columns[columnId];
              return (
                <ColumnTasks
                  key={column.id}
                  column={column}
                  taskMap={taskState.tasks}
                  index={index}
                  signedInMember={signedInMember}
                />
              );
            })}
            {provided.placeholder}
            {signedInMember?.accessPermission !== AccessPermission.ReadOnly && (
              <AddListMenu setProgress={setProgress} user={user}>
                <AddIcon />
                New list
              </AddListMenu>
            )}
          </Container>
        )}
      </Droppable>
    </DragDropContext>
  );
};

const mapStateToProps = (state: Store) => ({
  project: state.project,
  auth: state.auth,
});

const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, AnyAction>) => ({
  setNavbar: (selected: SelectedType) => dispatch(setNavbar(selected)),
  clearNavbar: () => dispatch(clearNavbar()),
  loadProject: (projectId: string) => dispatch(loadProject(projectId)),
  loadTaskState: (projectId: string) => dispatch(loadTaskState(projectId)),
});

const Container = styled.div<{ cursorProgress: boolean }>`
  display: flex;
  white-space: nowrap;
  position: relative;
  overflow-x: auto;
  margin-top: 30px;
  width: 103%;
  height: 80%;
  background-color: ${setColor.mainGrey};
  cursor: ${({ cursorProgress }) => (cursorProgress ? 'progress' : 'default')};
`;

export default connect(mapStateToProps, mapDispatchToProps)(Task);
