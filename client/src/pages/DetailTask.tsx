import React, { useEffect } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { useParams, Redirect, useLocation } from 'react-router-dom';

import { Store } from '../store';
import { clearNavbar, setNavbar } from '../actions/navbarAction';
import { loadProject } from '../actions/projectActions';
import { SelectedType } from '../actions/navbarTypes';
import { ProjectInitialState } from '../reducers/projectReducer';
import Paper from '../components/global/Paper';
import Previous from '../components/global/Previous';

interface DetailTaskProps {
  setNavbar: (selected: SelectedType) => void;
  loadProject: (projectId: string) => Promise<void>;
  clearNavbar: () => void;
  project: ProjectInitialState;
}

const DetailTask: React.FC<DetailTaskProps> = ({
  setNavbar,
  loadProject,
  clearNavbar,
  project: { selectedProject, projectError },
}) => {
  const { projectId, columnId, taskId } = useParams<{
    projectId: string;
    columnId: string;
    taskId: string;
  }>();
  const location = useLocation<{ taskTitle: string }>();

  useEffect(() => {
    document.title = 'Detail Task | DevCollab';
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

  return (
    <Paper>
      <Previous
        link={`/projects/${selectedProject?._id}/tasks`}
        previousTo='Tasks'
        title={location.state.taskTitle}
      />
    </Paper>
  );
};

const mapStateToProps = (state: Store) => ({
  project: state.project,
});

const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, AnyAction>) => ({
  clearNavbar: () => dispatch(clearNavbar()),
  setNavbar: (selected: SelectedType) => dispatch(setNavbar(selected)),
  loadProject: (projectId: string) => dispatch(loadProject(projectId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(DetailTask);
