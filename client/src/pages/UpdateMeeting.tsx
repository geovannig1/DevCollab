import React, { Fragment, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { useParams, useHistory } from 'react-router-dom';
import { History } from 'history';

import { Store } from '../store';
import { loadProject } from '../actions/projectActions';
import { ProjectInitialState } from '../reducers/projectReducer';
import { setNavbar, clearNavbar } from '../actions/navbarAction';
import { SelectedType } from '../actions/navbarTypes';
import Paper from '../components/global/Paper';
import Previous from '../components/global/Previous';
import { MeetingTypes } from '../actions/meetingTypes';
import {
  loadMeeting,
  updateMeeting,
  clearSelectedMeeting,
} from '../actions/meetingActions';
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
  clearSelectedMeeting: () => void;
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
  clearSelectedMeeting,
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

    projectError && history.push('/projects');

    return () => {
      clearNavbar();
      clearFullscreen();
      clearSelectedMeeting();
    };
  }, [
    loadProject,
    projectId,
    history,
    selectedProject,
    projectError,
    setNavbar,
    clearNavbar,
    loadMeeting,
    meetingId,
    setFullscreen,
    clearFullscreen,
    clearSelectedMeeting,
  ]);

  const handleMeetingSubmit = (roomData: MeetingTypes) => {
    updateMeeting(projectId, meetingId, roomData, history);
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

  useEffect(() => {
    selectedMeeting && setName(selectedMeeting.name);
  }, [selectedMeeting]);

  return (
    <Fragment>
      {selectedMeeting && (
        <Paper>
          <Previous
            link={`/projects/${projectId}/meeting-rooms`}
            previousTo='Meeting Rooms'
            title={name.trim() || 'Update Meeting'}
          />
          <MeetingForm
            projectId={projectId}
            selectedProject={selectedProject}
            selectedMeeting={selectedMeeting}
            handleMeetingSubmit={handleMeetingSubmit}
            setName={setName}
            user={user}
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
  clearSelectedMeeting: () => dispatch(clearSelectedMeeting()),
});

export default connect(mapStateToProps, mapDispatchToProps)(UpdateMeeting);
