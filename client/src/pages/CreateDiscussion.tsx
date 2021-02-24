import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { AnyAction } from 'redux';
import { useParams, Redirect, useHistory } from 'react-router-dom';
import { ThunkDispatch } from 'redux-thunk';
import { History } from 'history';

import { Store } from '../store';
import { loadProject } from '../actions/projectActions';
import { ProjectInitialState } from '../reducers/projectReducer';
import { setNavbar, clearNavbar } from '../actions/navbarAction';
import { SelectedType } from '../actions/navbarTypes';
import Paper from '../components/global/Paper';
import Previous from '../components/global/Previous';
import { DiscussionType } from '../actions/discussionTypes';
import { createDiscussion } from '../actions/discussionActions';
import DiscussionForm from '../components/discussion/DiscussionForm';
import { AccessPermission } from '../actions/projectTypes';
import { AuthInitialState } from '../reducers/authReducer';

interface CreateDiscussionProps {
  loadProject: (projectId: string) => Promise<void>;
  setNavbar: (selected: SelectedType) => void;
  clearNavbar: () => void;
  project: ProjectInitialState;
  auth: AuthInitialState;
  createDiscussion: (
    history: History,
    projectId: string,
    formData: DiscussionType,
    attachment?: File
  ) => Promise<void>;
}

const CreateDiscussion: React.FC<CreateDiscussionProps> = ({
  loadProject,
  setNavbar,
  clearNavbar,
  createDiscussion,
  project: { selectedProject, projectError },
  auth: { user },
}) => {
  const { projectId } = useParams<{ projectId: string }>();
  const history = useHistory();

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

  const [attachment, setAttachment] = useState<File>();
  const [discussionData, setDiscussionData] = useState<DiscussionType>({
    title: '',
    description: '',
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    createDiscussion(history, projectId, discussionData, attachment);
  };

  //find user in the project
  const userProject = selectedProject?.members.find(
    (member) => member.user._id === user?._id
  );
  //User with read only permission can't access
  if (userProject?.accessPermission === AccessPermission.ReadOnly) {
    history.push(`/projects/${projectId}/discussions`);
  }

  return (
    <Paper>
      <Previous
        link={`/projects/${projectId}/discussions`}
        previousTo='Discussions'
        title={discussionData.title.trim() || 'Create Discussion'}
      />

      <DiscussionForm
        handleSubmit={handleSubmit}
        projectId={projectId}
        setAttachment={setAttachment}
        setDiscussionData={setDiscussionData}
        discussionData={discussionData}
      />
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
  createDiscussion: (
    history: History,
    projectId: string,
    formData: DiscussionType,
    attachment?: File
  ) => dispatch(createDiscussion(history, projectId, formData, attachment)),
});

export default connect(mapStateToProps, mapDispatchToProps)(CreateDiscussion);
