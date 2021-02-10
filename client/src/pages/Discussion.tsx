import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { AnyAction } from 'redux';
import { useParams, Redirect, Link } from 'react-router-dom';
import { ThunkDispatch } from 'redux-thunk';

import { Store } from '../store';
import { loadProject } from '../actions/projectActions';
import { ProjectInitialState } from '../reducers/projectReducer';
import { setNavbar, clearNavbar } from '../actions/navbarAction';
import { SelectedType } from '../actions/navbarTypes';
import Paper from '../components/global/Paper';
import { Button } from '../components/global/Button';
import AddIcon from '@material-ui/icons/Add';
import DiscussionCard from '../components/discussion/DiscussionCard';

interface DiscussionProps {
  loadProject: (projectId: string) => Promise<void>;
  setNavbar: (selected: SelectedType) => void;
  clearNavbar: () => void;
  project: ProjectInitialState;
}

const Discussion: React.FC<DiscussionProps> = ({
  loadProject,
  setNavbar,
  clearNavbar,
  project: { selectedProject, projectError },
}) => {
  const { projectId } = useParams<{ projectId: string }>();

  useEffect(() => {
    document.title = 'Discussions | DevCollab';
    setNavbar(SelectedType.Discussions);

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
      <Button
        as={Link}
        to={`/projects/${projectId}/create-discussion`}
        extrasmall={'extrasmall' && 1}
      >
        <AddIcon /> New Discussion
      </Button>
      <DiscussionCard />
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

export default connect(mapStateToProps, mapDispatchToProps)(Discussion);
