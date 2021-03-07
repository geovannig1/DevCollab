import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { useParams, Redirect } from 'react-router-dom';
import styled from 'styled-components';

import { Store } from '../store';
import { loadProject } from '../actions/projectActions';
import { ProjectInitialState } from '../reducers/projectReducer';
import { setNavbar, clearNavbar } from '../actions/navbarAction';
import { SelectedType } from '../actions/navbarTypes';
import { Button } from '../components/global/Button';
import GitHubIcon from '@material-ui/icons/GitHub';
import Paper from '../components/global/Paper';
import { Form } from '../components/global/FormContainer';
import Previous from '../components/global/Previous';

interface GithubConnectionProps {
  loadProject: (projectId: string) => Promise<void>;
  setNavbar: (selected: SelectedType) => void;
  clearNavbar: () => void;
  project: ProjectInitialState;
}

const GithubConnection: React.FC<GithubConnectionProps> = ({
  loadProject,
  setNavbar,
  clearNavbar,
  project: { selectedProject, projectError },
}) => {
  const { projectId } = useParams<{ projectId: string }>();

  useEffect(() => {
    document.title = 'GitHub Connection | DevCollab';
    setNavbar(SelectedType.Github);

    !selectedProject && loadProject(projectId);
    projectError && <Redirect to='/projects' />;

    return () => clearNavbar();
  }, [
    loadProject,
    projectId,
    selectedProject,
    projectError,
    setNavbar,
    clearNavbar,
  ]);

  return (
    <Paper>
      <Previous
        previousTo='Github Activity'
        link={`/projects/${projectId}/github-activity`}
        title='Github Connection'
      />
      <Form>
        <StyledButton
          extrasmall
          as='a'
          href={`/api/auth/github/projects/${projectId}`}
        >
          <StyledGitHubIcon /> Create Connection
        </StyledButton>
      </Form>
    </Paper>
  );
};

const mapStateToProps = (state: Store) => ({
  project: state.project,
  auth: state.auth,
});

const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, AnyAction>) => ({
  loadProject: (projectId: string) => dispatch(loadProject(projectId)),
  setNavbar: (selected: SelectedType) => dispatch(setNavbar(selected)),
  clearNavbar: () => dispatch(clearNavbar()),
});

const StyledGitHubIcon = styled(GitHubIcon)`
  margin-right: 5px;
`;

const StyledButton = styled(Button)``;

export default connect(mapStateToProps, mapDispatchToProps)(GithubConnection);
