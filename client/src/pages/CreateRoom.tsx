import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { useParams, Redirect, useHistory } from 'react-router-dom';
import { History } from 'history';

import { Store } from '../store';
import { loadProject } from '../actions/projectActions';
import { ProjectInitialState } from '../reducers/projectReducer';
import { setNavbar, clearNavbar } from '../actions/navbarAction';
import { SelectedType } from '../actions/navbarTypes';
import Paper from '../components/global/Paper';
import Previous from '../components/global/Previous';
import { MeetingTypes } from '../actions/meetingTypes';
import { createMeeting } from '../actions/meetingActions';
import MeetingForm from '../components/meeting/MeetingForm';
import { AuthInitialState } from '../reducers/authReducer';
import { AccessPermission } from '../actions/projectTypes';

interface CreateRoomProps {
  loadProject: (projectId: string) => Promise<void>;
  setNavbar: (selected: SelectedType) => void;
  clearNavbar: () => void;
  createMeeting: (
    projectId: string,
    formData: MeetingTypes,
    history: History
  ) => Promise<void>;
  project: ProjectInitialState;
  auth: AuthInitialState;
}

const CreateRoom: React.FC<CreateRoomProps> = ({
  loadProject,
  setNavbar,
  clearNavbar,
  createMeeting,
  project: { selectedProject, projectError },
  auth: { user },
}) => {
  const { projectId } = useParams<{ projectId: string }>();
  const history = useHistory();

  useEffect(() => {
    document.title = 'Create Room | DevCollab';
    setNavbar(SelectedType.Meeting);

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

  const handleMeetingSubmit = (roomData: MeetingTypes) => {
    createMeeting(projectId, roomData, history);
  };

  //find user in the project
  const userProject = selectedProject?.members.find(
    (member) => member.user._id === user?._id
  );
  //User with read only permission can't access
  if (userProject?.accessPermission === AccessPermission.ReadOnly) {
    history.push(`/projects/${projectId}/meeting-rooms`);
  }

  const [name, setName] = useState('');

  return (
    <Paper>
      <Previous
        link={`/projects/${projectId}/meeting-rooms`}
        previousTo='Meeting Rooms'
        title={name.trim() || 'Create Room'}
      />
      <MeetingForm
        projectId={projectId}
        selectedProject={selectedProject}
        handleMeetingSubmit={handleMeetingSubmit}
        setName={setName}
        user={user}
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
  createMeeting: (
    projectId: string,
    formData: MeetingTypes,
    history: History
  ) => dispatch(createMeeting(projectId, formData, history)),
});

export default connect(mapStateToProps, mapDispatchToProps)(CreateRoom);
