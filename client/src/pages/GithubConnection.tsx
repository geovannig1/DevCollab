import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { useParams, Link, useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { History } from 'history';

import { Store } from '../store';
import { loadProject } from '../actions/projectActions';
import { ProjectInitialState } from '../reducers/projectReducer';
import { setNavbar, clearNavbar } from '../actions/navbarAction';
import { SelectedType } from '../actions/navbarTypes';
import { Button } from '../components/global/Button';
import Paper from '../components/global/Paper';
import Previous from '../components/global/Previous';
import SettingsApplicationsOutlinedIcon from '@material-ui/icons/SettingsApplicationsOutlined';
import { setColor } from '../styles';
import { loadRepos, storeRepo } from '../actions/githubActions';
import { GithubInitialState } from '../reducers/githubReducer';
import TextField from '@material-ui/core/TextField';
import Autocomplete, {
  AutocompleteChangeDetails,
  AutocompleteChangeReason,
} from '@material-ui/lab/Autocomplete';
import Alert from '../components/global/Alert';
import { AccessPermission } from '../actions/projectTypes';
import { AuthInitialState } from '../reducers/authReducer';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

interface GithubConnectionProps {
  loadProject: (projectId: string) => Promise<void>;
  setNavbar: (selected: SelectedType) => void;
  clearNavbar: () => void;
  loadRepos: (projectId: string) => Promise<void>;
  storeRepo: (
    projectId: string,
    repositoryName: string,
    history: History
  ) => Promise<void>;
  project: ProjectInitialState;
  github: GithubInitialState;
  auth: AuthInitialState;
}

const GithubConnection: React.FC<GithubConnectionProps> = ({
  loadProject,
  setNavbar,
  clearNavbar,
  loadRepos,
  storeRepo,
  project: { selectedProject, projectError },
  github: { repos },
  auth: { user },
}) => {
  const classes = useStyles();
  const { projectId } = useParams<{ projectId: string }>();
  const history = useHistory();

  useEffect(() => {
    document.title = 'GitHub Connection | DevCollab';
    setNavbar(SelectedType.Github);

    !selectedProject && loadProject(projectId);
    projectError && history.push('/projects');

    return () => clearNavbar();
  }, [
    loadProject,
    projectId,
    history,
    selectedProject,
    projectError,
    setNavbar,
    clearNavbar,
  ]);

  useEffect(() => {
    loadRepos(projectId);
  }, [projectId, loadRepos]);

  const [repositoryName, setRepositoryName] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    storeRepo(projectId, repositoryName, history);
  };

  const handleChange = (
    event: React.ChangeEvent<{}>,
    value: string | null,
    reason: AutocompleteChangeReason,
    details?: AutocompleteChangeDetails<string> | undefined
  ) => {
    setRepositoryName(value ?? '');
  };

  //find user in the project
  const userProject = selectedProject?.members.find(
    (member) => member.user._id === user?._id
  );
  //User with read only permission can't access
  if (userProject?.accessPermission !== AccessPermission.Admin) {
    history.push(`/projects/${projectId}/github-activity`);
  }

  return (
    <Paper>
      <Previous
        previousTo='Github Activity'
        link={`/projects/${projectId}/github-activity`}
        title='Github Connection'
      />
      <Container>
        <StyledButton
          extrasmall
          outline
          as='a'
          href={`/api/auth/github/projects/${projectId}`}
        >
          <SettingsApplicationsOutlinedIcon /> Configure Connection
        </StyledButton>

        <Form onSubmit={handleSubmit}>
          <Autocomplete
            id='combo-box-demo'
            options={repos?.map((repo) => repo.name) ?? []}
            getOptionLabel={(option) => option}
            className={classes.autoComplete}
            size='small'
            color={setColor.primary}
            onChange={handleChange}
            value={repositoryName}
            renderInput={(params) => (
              <TextField
                {...params}
                label='Choose Repository'
                variant='outlined'
              />
            )}
          />

          <StyledButton extrasmall>Save</StyledButton>
          <StyledButton
            as={Link}
            to={`/projects/${projectId}/github-activity`}
            extrasmall={'extrasmall' && 1}
            outline={'outline' && 1}
          >
            Cancel
          </StyledButton>
        </Form>
        <Alert />
      </Container>
    </Paper>
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
  loadRepos: (projectId: string) => dispatch(loadRepos(projectId)),
  storeRepo: (projectId: string, repositoryName: string, history: History) =>
    dispatch(storeRepo(projectId, repositoryName, history)),
});

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    autoComplete: {
      width: 300,
      [theme.breakpoints.down('xs')]: {
        width: 200,
      },
    },
  })
);

const Container = styled.div`
  margin: 10px 0;
`;

const Form = styled.form`
  margin: 15px 0;
`;

const StyledButton = styled(Button)`
  margin-top: 20px;
  margin-right: 10px;
`;

export default connect(mapStateToProps, mapDispatchToProps)(GithubConnection);
