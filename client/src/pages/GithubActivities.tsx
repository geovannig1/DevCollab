import React, { Fragment, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { useParams, Redirect, Link } from 'react-router-dom';
import styled from 'styled-components';

import { Store } from '../store';
import { loadProject } from '../actions/projectActions';
import { ProjectInitialState } from '../reducers/projectReducer';
import { setNavbar, clearNavbar } from '../actions/navbarAction';
import { SelectedType } from '../actions/navbarTypes';
import { Button } from '../components/global/Button';
import GitHubIcon from '@material-ui/icons/GitHub';
import { loadCommits } from '../actions/githubActions';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Paper from '@material-ui/core/Paper';
import Commits from '../components/github/Commits';
import Pulls from '../components/github/Pulls';

interface GithubActivitiesProps {
  loadProject: (projectId: string) => Promise<void>;
  setNavbar: (selected: SelectedType) => void;
  clearNavbar: () => void;
  project: ProjectInitialState;
}

const GithubActivities: React.FC<GithubActivitiesProps> = ({
  loadProject,
  setNavbar,
  clearNavbar,
  project: { selectedProject, projectError },
}) => {
  const { projectId } = useParams<{ projectId: string }>();

  useEffect(() => {
    document.title = 'GitHub Activity | DevCollab';
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

  const [value, setValue] = React.useState(0);
  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };

  const handlePageChange = () => {
    switch (value) {
      case 0:
        return <Commits projectId={projectId} />;
      case 1:
        return <Pulls projectId={projectId} />;
    }
  };

  return (
    <Fragment>
      <Button
        extrasmall={'extrasmall' && 1}
        as={Link}
        to={`/projects/${projectId}/github-connection`}
      >
        <StyledGitHubIcon /> GitHub Connection
      </Button>

      <StyledPaper>
        <Tabs
          indicatorColor='primary'
          textColor='primary'
          value={value}
          onChange={handleChange}
        >
          <Tab label='Commits' />
          <Tab label='Pull Requests' />
        </Tabs>
      </StyledPaper>

      {handlePageChange()}
    </Fragment>
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

const StyledPaper = styled(Paper)`
  margin-top: 15px;
`;

export default connect(mapStateToProps, mapDispatchToProps)(GithubActivities);
