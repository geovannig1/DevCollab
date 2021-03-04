import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';

import { setColor, setShadow } from '../../styles';
import PeopleIcon from '@material-ui/icons/People';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import CardMenu from '../global/CardMenu';
import { MeetingTypes } from '../../actions/meetingTypes';
import { ReactComponent as Meeting } from '../../assets/meeting2.svg';
import { deleteMeeting } from '../../actions/meetingActions';
import { UserType } from '../../actions/authTypes';
import { AccessPermission, ProjectType } from '../../actions/projectTypes';
import socket from '../../utils/socketio';

interface RoomCardProps {
  meetingRoom: MeetingTypes;
  projectId: string;
  selectedProject?: ProjectType;
  user?: UserType;
  deleteMeeting: (projectId: string, meetingId: string) => Promise<void>;
}

const RoomCard: React.FC<RoomCardProps> = ({
  meetingRoom,
  projectId,
  selectedProject,
  user,
  deleteMeeting,
}) => {
  const handleDelete = () => {
    deleteMeeting(projectId, meetingRoom._id ?? '');

    socket.emit('delete activity meeting', {
      projectId,
      userName: `${user?.firstName} ${user?.lastName}`,
      roomName: meetingRoom.name,
    });
  };

  //find user in the project
  const userProject = selectedProject?.members.find(
    (member) => member.user._id === user?._id
  );

  return (
    <Container>
      <StyledLink
        to={`/projects/${projectId}/meeting-rooms/${meetingRoom._id}`}
      >
        <CardContainer>
          <StyledMeetingIcon />

          <UserContainer>
            <PeopleIcon /> <span>{meetingRoom.usersInRoom?.length}</span>
          </UserContainer>

          <H3>{meetingRoom.name}</H3>
        </CardContainer>
      </StyledLink>

      <MenuContainer>
        {userProject?.accessPermission !== AccessPermission.ReadOnly && (
          <CardMenu
            deleteItem={handleDelete}
            deleteText={`Are you sure want to delete ${meetingRoom.name} room? this process can't be undone.`}
            deleteTitle='Delete Room'
            editLink={`/projects/${projectId}/meeting-rooms/${meetingRoom._id}/edit`}
          >
            <HorizIcon fontSize='large' />
          </CardMenu>
        )}
      </MenuContainer>
    </Container>
  );
};

const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, AnyAction>) => ({
  deleteMeeting: (projectId: string, meetingId: string) =>
    dispatch(deleteMeeting(projectId, meetingId)),
});

const StyledLink = styled(Link)`
  color: ${setColor.mainBlack};
  text-decoration: none;
  outline: none;
`;

const Container = styled.div`
  position: relative;
  height: 200px;
  width: 210px;
  user-select: none;
`;

const CardContainer = styled.div`
  display: grid;
  justify-content: center;
  justify-items: center;
  width: 100%;
  height: 100%;
  align-content: center;
  align-items: center;
  background-color: ${setColor.mainWhite};
  border-radius: 8px;
  box-shadow: ${setShadow.main};
  transition: 0.3s ease-in-out;
  cursor: pointer;
  &:hover {
    box-shadow: ${setShadow.hover};
  }
  &:active {
    box-shadow: ${setShadow.main};
  }
`;

const StyledMeetingIcon = styled(Meeting)`
  color: ${setColor.primaryDark};
  width: 100px;
  height: 100px;
  margin-bottom: 10px;
`;

const UserContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  span {
    margin: 0 5px;
    font-weight: 600;
  }
`;

const MenuContainer = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  margin-right: 10px;
  cursor: pointer;
`;

const HorizIcon = styled(MoreHorizIcon)`
  color: ${setColor.lightBlack};
  transition: 0.2s ease-in-out;
  &:hover {
    color: ${setColor.mainBlack};
  }
  &:active {
    color: ${setColor.lightBlack};
  }
`;

const H3 = styled.h3`
  font-weight: 600;
`;

export default connect(null, mapDispatchToProps)(RoomCard);
