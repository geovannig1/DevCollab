import React, { Fragment, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Redirect, useParams, useHistory } from 'react-router-dom';
import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { History } from 'history';

import { clearNavbar, setNavbar } from '../actions/navbarAction';
import { SelectedType } from '../actions/navbarTypes';
import { loadProject } from '../actions/projectActions';
import { ProjectInitialState } from '../reducers/projectReducer';
import { Store } from '../store';
import DiscussionForm from '../components/discussion/DiscussionForm';
import Paper from '../components/global/Paper';
import { DiscussionType } from '../actions/discussionTypes';
import {
  loadDiscussion,
  updateDiscussion,
  clearSelectedDiscussion,
} from '../actions/discussionActions';
import Previous from '../components/global/Previous';
import { DiscussionInitialState } from '../reducers/discussionReducer';
import { AuthInitialState } from '../reducers/authReducer';
import { AccessPermission } from '../actions/projectTypes';

interface UpdateDiscussionProps {
  loadProject: (projectId: string) => Promise<void>;
  setNavbar: (selected: SelectedType) => void;
  clearNavbar: () => void;
  loadDiscussion: (projectId: string, discussionId: string) => Promise<void>;
  updateDiscussion: (
    history: History,
    projectId: string,
    discussionId: string,
    formData: DiscussionType,
    attachment?: File
  ) => Promise<void>;
  clearSelectedDiscussion: () => void;
  discussion: DiscussionInitialState;
  project: ProjectInitialState;
  auth: AuthInitialState;
}

const UpdateDiscussion: React.FC<UpdateDiscussionProps> = ({
  loadProject,
  setNavbar,
  clearNavbar,
  loadDiscussion,
  updateDiscussion,
  clearSelectedDiscussion,
  project: { selectedProject, projectError },
  auth: { user },
  discussion: { selectedDiscussion },
}) => {
  const { projectId, discussionId } = useParams<{
    projectId: string;
    discussionId: string;
  }>();
  const history = useHistory();

  useEffect(() => {
    document.title = 'Update Discussion | DevCollab';
    setNavbar(SelectedType.Discussions);

    !selectedProject && loadProject(projectId);
    projectError && <Redirect to='/projects' />;

    return () => {
      clearNavbar();
      clearSelectedDiscussion();
    };
  }, [
    loadProject,
    projectId,
    selectedProject,
    projectError,
    setNavbar,
    clearNavbar,
    clearSelectedDiscussion,
  ]);

  useEffect(() => {
    loadDiscussion(projectId, discussionId);
  }, [loadDiscussion, projectId, discussionId]);

  const handleDiscussionSubmit = (
    discussionData: DiscussionType,
    attachment?: File
  ) => {
    updateDiscussion(
      history,
      projectId,
      discussionId,
      discussionData,
      attachment
    );
  };

  //Redirect user if the access permission is ReadOnly
  useEffect(() => {
    //Find user in the project
    const findUser = selectedProject?.members?.find(
      (member) => member.user._id === user?._id
    );

    if (findUser?.accessPermission === AccessPermission.ReadOnly) {
      history.push(`/projects/${projectId}/discussions`);
    }
  }, [projectId, selectedProject?.members, user?._id, history]);

  const [title, setTitle] = useState('');

  useEffect(() => {
    selectedDiscussion && setTitle(selectedDiscussion.title);
  }, [selectedDiscussion]);

  return (
    <Fragment>
      {selectedDiscussion && (
        <Paper>
          <Previous
            title={title.trim() || 'Update Discussion'}
            link={`/projects/${projectId}/discussions`}
            previousTo='Discussions'
          />
          <DiscussionForm
            projectId={projectId}
            handleDiscussionSubmit={handleDiscussionSubmit}
            setTitle={setTitle}
            selectedDiscussion={selectedDiscussion}
            update
          />
        </Paper>
      )}
    </Fragment>
  );
};

const mapStateToProps = (state: Store) => ({
  project: state.project,
  discussion: state.discussion,
  auth: state.auth,
});

const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, AnyAction>) => ({
  loadProject: (projectId: string) => dispatch(loadProject(projectId)),
  setNavbar: (selected: SelectedType) => dispatch(setNavbar(selected)),
  clearNavbar: () => dispatch(clearNavbar()),
  loadDiscussion: (projectId: string, discussionId: string) =>
    dispatch(loadDiscussion(projectId, discussionId)),
  updateDiscussion: (
    history: History,
    projectId: string,
    discussionId: string,
    formData: DiscussionType,
    attachment?: File
  ) =>
    dispatch(
      updateDiscussion(history, projectId, discussionId, formData, attachment)
    ),
  clearSelectedDiscussion: () => dispatch(clearSelectedDiscussion()),
});

export default connect(mapStateToProps, mapDispatchToProps)(UpdateDiscussion);
