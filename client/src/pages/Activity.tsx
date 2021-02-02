import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { useParams, useHistory } from 'react-router-dom';
import styled from 'styled-components';

import { setColor } from '../styles';
import { Store } from '../store';
import { loadProject } from '../actions/projectActions';
import { ProjectInitialState } from '../reducers/projectReducer';
import { setNavbar, clearNavbar } from '../actions/navbarAction';
import { SelectedType } from '../actions/navbarTypes';
import Paper from '../components/global/Paper';

interface ActivityProps {
  loadProject: (projectId: string) => Promise<void>;
  setNavbar: (selected: SelectedType) => void;
  clearNavbar: () => void;
  project: ProjectInitialState;
}

const Activity: React.FC<ActivityProps> = ({
  loadProject,
  setNavbar,
  clearNavbar,
  project: { selectedProject, projectError },
}) => {
  const { projectId } = useParams<{ projectId: string }>();
  const history = useHistory();

  useEffect(() => {
    document.title = 'Activity | DevCollab';
    setNavbar(SelectedType.Activity);

    !selectedProject && loadProject(projectId);
    projectError && history.push('/projects');

    return () => clearNavbar();
  }, [
    loadProject,
    projectId,
    selectedProject,
    history,
    projectError,
    setNavbar,
    clearNavbar,
  ]);

  return (
    <Paper>
      <Container>
        <Content />
        <Input placeholder='Write a message...' />
      </Container>
    </Paper>
  );
};

const mapStateToProps = (state: Store) => ({
  project: state.project,
});

const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, AnyAction>) => ({
  loadProject: (projectId: string) => dispatch(loadProject(projectId)),
  setNavbar: (selected: SelectedType) => dispatch(setNavbar(selected)),
  clearNavbar: () => dispatch(clearNavbar()),
});

const Container = styled.div`
  min-height: 68vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const Content = styled.div``;

const Input = styled.input`
  width: 100%;
  height: 15%;
  border: 1px solid ${setColor.lightBlack};
  outline: none;
  padding: 15px;
  border-radius: 5px;
  &:focus {
    border-color: ${setColor.primary};
  }
`;

export default connect(mapStateToProps, mapDispatchToProps)(Activity);
