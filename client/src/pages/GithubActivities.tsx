import React, { Fragment, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { useParams, Redirect, Link } from 'react-router-dom';
import styled from 'styled-components';

import { Store } from '../store';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import MaterialButton from '@material-ui/core/Button';
import { loadProject } from '../actions/projectActions';
import { ProjectInitialState } from '../reducers/projectReducer';
import { setNavbar, clearNavbar } from '../actions/navbarAction';
import { SelectedType } from '../actions/navbarTypes';
import GithubCard from '../components/github/GithubCard';
import { Button } from '../components/global/Button';
import GitHubIcon from '@material-ui/icons/GitHub';
import { loadCommits } from '../actions/githubActions';
import { GithubInitialState } from '../reducers/githubReducer';

interface GithubActivitiesProps {
  loadProject: (projectId: string) => Promise<void>;
  setNavbar: (selected: SelectedType) => void;
  clearNavbar: () => void;
  loadCommits: (projectId: string, page: number) => Promise<void>;
  project: ProjectInitialState;
  github: GithubInitialState;
}

const GithubActivities: React.FC<GithubActivitiesProps> = ({
  loadProject,
  setNavbar,
  clearNavbar,
  loadCommits,
  project: { selectedProject, projectError },
  github: { commit },
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

  const [page, setPage] = useState(1);
  const lastPage = commit?.pageInfo.last?.page;

  useEffect(() => {
    loadCommits(projectId, page);
  }, [loadCommits, projectId, page]);

  return (
    <Fragment>
      {commit && (
        <Fragment>
          <Button
            extrasmall={'extrasmall' && 1}
            as={Link}
            to={`/projects/${projectId}/github-connection`}
          >
            <StyledGitHubIcon /> GitHub Connection
          </Button>

          {commit?.commits.map((commit) => (
            <GithubCard key={commit.node_id} commit={commit} />
          ))}

          <ButtonGroup
            color='primary'
            aria-label='outlined primary button group'
            size='large'
          >
            <MaterialButton
              disabled={page === 1}
              onClick={() => page > 1 && setPage(page - 1)}
            >
              Newer
            </MaterialButton>
            <MaterialButton
              disabled={!lastPage}
              onClick={() => page < (lastPage ?? 1) && setPage(page + 1)}
            >
              Older
            </MaterialButton>
          </ButtonGroup>
        </Fragment>
      )}
    </Fragment>
  );
};

const mapStateToProps = (state: Store) => ({
  project: state.project,
  auth: state.auth,
  github: state.github,
});

const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, AnyAction>) => ({
  loadProject: (projectId: string) => dispatch(loadProject(projectId)),
  setNavbar: (selected: SelectedType) => dispatch(setNavbar(selected)),
  clearNavbar: () => dispatch(clearNavbar()),
  loadCommits: (projectId: string, page: number) =>
    dispatch(loadCommits(projectId, page)),
});

const StyledGitHubIcon = styled(GitHubIcon)`
  margin-right: 5px;
`;

export default connect(mapStateToProps, mapDispatchToProps)(GithubActivities);
