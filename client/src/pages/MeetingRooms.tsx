import React, { Fragment, useEffect } from 'react';
import { connect } from 'react-redux';
import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { useParams, Redirect, Link } from 'react-router-dom';
import styled from 'styled-components';
import { Button } from '../components/global/Button';

import { Store } from '../store';
import { loadProject } from '../actions/projectActions';
import { ProjectInitialState } from '../reducers/projectReducer';
import { setNavbar, clearNavbar } from '../actions/navbarAction';
import { SelectedType } from '../actions/navbarTypes';
import AddIcon from '@material-ui/icons/Add';
import RoomCard from '../components/meeting/RoomCard';
import { loadMeetings } from '../actions/meetingActions';
import { MeetingInitialState } from '../reducers/meetingReducer';

interface MeetingRoomsProps {
  loadProject: (projectId: string) => Promise<void>;
  setNavbar: (selected: SelectedType) => void;
  clearNavbar: () => void;
  loadMeetings: (projectId: string) => Promise<void>;
  project: ProjectInitialState;
  meeting: MeetingInitialState;
}

const MeetingRooms: React.FC<MeetingRoomsProps> = ({
  loadProject,
  setNavbar,
  clearNavbar,
  loadMeetings,
  project: { selectedProject, projectError },
  meeting: { meetings },
}) => {
  const { projectId } = useParams<{ projectId: string }>();

  useEffect(() => {
    document.title = 'Meeting Rooms | DevCollab';
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

  useEffect(() => {
    !meetings && loadMeetings(projectId);
  }, [loadMeetings, projectId, meetings]);

  const handleDelete = async () => {};

  return (
    <Fragment>
      <Button
        as={Link}
        to={`/projects/${projectId}/create-room`}
        extrasmall={'extrasmall' && 1}
      >
        <AddIcon /> New Room
      </Button>

      <Container>
        {meetings?.map((meeting) => (
          <RoomCard
            key={meeting._id}
            meetingRoom={meeting}
            projectId={projectId}
          />
        ))}
      </Container>
    </Fragment>
  );
};

const mapStateToProps = (state: Store) => ({
  project: state.project,
  meeting: state.meeting,
});

const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, AnyAction>) => ({
  loadProject: (projectId: string) => dispatch(loadProject(projectId)),
  setNavbar: (selected: SelectedType) => dispatch(setNavbar(selected)),
  clearNavbar: () => dispatch(clearNavbar()),
  loadMeetings: (projectId: string) => dispatch(loadMeetings(projectId)),
});

const Container = styled.div`
  margin: 15px 0;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 50px 20px;
`;

export default connect(mapStateToProps, mapDispatchToProps)(MeetingRooms);
