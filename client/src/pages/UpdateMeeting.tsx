import React, { Fragment, useEffect, useState } from 'react';
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
import { loadMeeting, updateMeeting } from '../actions/meetingActions';
import MeetingForm from '../components/meeting/MeetingForm';
import { setFullscreen, clearFullscreen } from '../actions/displayActions';
import { MeetingInitialState } from '../reducers/meetingReducer';
import { AccessPermission } from '../actions/projectTypes';
import { AuthInitialState } from '../reducers/authReducer';

interface UpdateMeetingProps {
  loadProject: (projectId: string) => Promise<void>;
  setNavbar: (selected: SelectedType) => void;
  clearNavbar: () => void;
  loadMeeting: (projectId: string, meetingId: string) => Promise<void>;
  setFullscreen: (fullscreen: boolean) => void;
  clearFullscreen: () => void;
  updateMeeting: (
    projectId: string,
    meetingId: string,
    formData: MeetingTypes,
    history: History
  ) => Promise<void>;
  project: ProjectInitialState;
  meeting: MeetingInitialState;
  auth: AuthInitialState;
}

const UpdateMeeting: React.FC<UpdateMeetingProps> = ({
  loadProject,
  setNavbar,
  clearNavbar,
  loadMeeting,
  setFullscreen,
  clearFullscreen,
  updateMeeting,
  project: { selectedProject, projectError },
  meeting: { selectedMeeting },
  auth: { user },
}) => {
  const { projectId, meetingId } = useParams<{
    projectId: string;
    meetingId: string;
  }>();
  const history = useHistory();

  useEffect(() => {
    document.title = 'Update Meeting | DevCollab';
    setNavbar(SelectedType.Meeting);

    !selectedProject && loadProject(projectId);
    loadMeeting(projectId, meetingId);
    setFullscreen(false);

    projectError && <Redirect to='/projects' />;

    return () => {
      clearNavbar();
      clearFullscreen();
    };
  }, [
    loadProject,
    projectId,
    selectedProject,
    projectError,
    setNavbar,
    clearNavbar,
    loadMeeting,
    meetingId,
    setFullscreen,
    clearFullscreen,
  ]);

  const [roomData, setRoomData] = useState<MeetingTypes>({
    name: '',
    members: [],
  });

  //Set the update form value
  useEffect(() => {
    if (selectedMeeting) {
      setRoomData({
        name: selectedMeeting.name,
        members: selectedMeeting.members,
      });
    }
  }, [selectedMeeting]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    updateMeeting(projectId, meetingId, roomData, history);
  };

  //Get the meeting members with avatar, access permission and email
  const roomMemberIds = selectedMeeting?.members.map(
    (member) => member.user._id
  );
  const roomMembers = selectedProject?.members.filter((member) =>
    roomMemberIds?.includes(member.user._id.toString())
  );

  //find user in the project
  const userProject = selectedProject?.members.find(
    (member) => member.user._id === user?._id
  );
  //User with read only permission can't access
  if (userProject?.accessPermission === AccessPermission.ReadOnly) {
    history.push(`/projects/${projectId}/meeting-rooms`);
  }

  return (
    <Fragment>
      {selectedMeeting && (
        <Paper>
          <Previous
            link={`/projects/${projectId}/meeting-rooms`}
            previousTo='Meeting Rooms'
            title={roomData.name || 'Update Meeting'}
          />
          <MeetingForm
            projectId={projectId}
            selectedProject={selectedProject}
            handleSubmit={handleSubmit}
            roomData={roomData}
            setRoomData={setRoomData}
            selectData={roomMembers}
            update
          />
        </Paper>
      )}
    </Fragment>
  );
};

const mapStateToProps = (state: Store) => ({
  project: state.project,
  meeting: state.meeting,
  auth: state.auth,
});

const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, AnyAction>) => ({
  loadProject: (projectId: string) => dispatch(loadProject(projectId)),
  setNavbar: (selected: SelectedType) => dispatch(setNavbar(selected)),
  clearNavbar: () => dispatch(clearNavbar()),
  loadMeeting: (projectId: string, meetingId: string) =>
    dispatch(loadMeeting(projectId, meetingId)),
  setFullscreen: (fullscreen: boolean) => dispatch(setFullscreen(fullscreen)),
  clearFullscreen: () => dispatch(clearFullscreen()),
  updateMeeting: (
    projectId: string,
    meetingId: string,
    formData: MeetingTypes,
    history: History
  ) => dispatch(updateMeeting(projectId, meetingId, formData, history)),
});

export default connect(mapStateToProps, mapDispatchToProps)(UpdateMeeting);
