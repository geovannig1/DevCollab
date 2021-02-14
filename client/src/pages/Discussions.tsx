import React, { Fragment, useEffect } from 'react';
import { connect } from 'react-redux';
import { AnyAction } from 'redux';
import { useParams, Redirect, Link } from 'react-router-dom';
import { ThunkDispatch } from 'redux-thunk';

import { Store } from '../store';
import { loadProject } from '../actions/projectActions';
import { ProjectInitialState } from '../reducers/projectReducer';
import { setNavbar, clearNavbar } from '../actions/navbarAction';
import { SelectedType } from '../actions/navbarTypes';
import { Button } from '../components/global/Button';
import AddIcon from '@material-ui/icons/Add';
import DiscussionCard from '../components/discussion/DiscussionCard';
import { DiscussionInitialState } from '../reducers/discussionReducer';
import { loadDiscussions } from '../actions/discussionActions';

interface DiscussionsProps {
  loadProject: (projectId: string) => Promise<void>;
  setNavbar: (selected: SelectedType) => void;
  clearNavbar: () => void;
  loadDiscussions: (projectId: string) => Promise<void>;
  project: ProjectInitialState;
  discussion: DiscussionInitialState;
}

const Discussions: React.FC<DiscussionsProps> = ({
  loadProject,
  setNavbar,
  clearNavbar,
  project: { selectedProject, projectError },
  discussion: { discussions },
  loadDiscussions,
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

  useEffect(() => {
    loadDiscussions(projectId);
  }, [loadDiscussions, projectId]);

  return (
    <Fragment>
      <Button
        as={Link}
        to={`/projects/${projectId}/create-discussion`}
        extrasmall={'extrasmall' && 1}
      >
        <AddIcon /> New Discussion
      </Button>

      {discussions.map((discussion) => (
        <DiscussionCard
          key={discussion._id}
          discussion={discussion}
          totalDiscussions={discussion.comments?.length ?? 0}
          projectId={projectId}
        />
      ))}
    </Fragment>
  );
};

const mapStateToProps = (state: Store) => ({
  project: state.project,
  discussion: state.discussion,
});

const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, AnyAction>) => ({
  loadProject: (projectId: string) => dispatch(loadProject(projectId)),
  setNavbar: (selected: SelectedType) => dispatch(setNavbar(selected)),
  clearNavbar: () => dispatch(clearNavbar()),
  loadDiscussions: (projectId: string) => dispatch(loadDiscussions(projectId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Discussions);
