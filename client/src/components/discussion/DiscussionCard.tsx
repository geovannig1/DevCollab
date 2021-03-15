import React from 'react';
import styled from 'styled-components';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Link } from 'react-router-dom';
import { AnyAction } from 'redux';
import { connect } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';

import { setColor, setShadow, setRem } from '../../styles';
import CommentOutlinedIcon from '@material-ui/icons/CommentOutlined';
import MoreHorizOutlinedIcon from '@material-ui/icons/MoreHorizOutlined';
import { DiscussionType } from '../../actions/discussionTypes';
import CardMenu from '../global/CardMenu';
import { deleteDiscussion } from '../../actions/discussionActions';
import { AccessPermission, ProjectType } from '../../actions/projectTypes';
import { UserType } from '../../actions/authTypes';
import socket from '../../utils/socketio';

interface DiscussionCardProps {
  discussion: DiscussionType;
  totalDiscussions: number;
  selectedProject?: ProjectType;
  deleteDiscussion: (projectId: string, discussionId: string) => Promise<void>;
  projectId: string;
  user?: UserType;
}

const DiscussionCard: React.FC<DiscussionCardProps> = ({
  discussion,
  totalDiscussions,
  selectedProject,
  deleteDiscussion,
  projectId,
  user,
}) => {
  //Extend dayjs with relativeTime
  dayjs.extend(relativeTime);

  const handleDelete = () => {
    deleteDiscussion(selectedProject?._id ?? '', discussion._id ?? '');

    //Send discussion activity
    socket.emit('delete activity discussion', {
      projectId,
      discussionName: discussion.title,
      userName: `${user?.firstName} ${user?.lastName}`,
      userId: user?._id,
    });
  };

  //Find user in the project
  const findUser = selectedProject?.members?.find(
    (member) => member.user._id === user?._id
  );

  return (
    <Container>
      <StyledLink
        to={`/projects/${selectedProject?._id}/discussions/${discussion._id}`}
      >
        <Card>
          <ContainerLeft>
            <CommentOutlinedIcon />
            <span>{totalDiscussions}</span>
            <h4>{discussion.title}</h4>
          </ContainerLeft>
          <ContainerRight>
            <span>{dayjs(discussion.date).fromNow()}</span>
          </ContainerRight>
        </Card>
      </StyledLink>
      {findUser?.accessPermission !== AccessPermission.ReadOnly && (
        <MenuContainer>
          <CardMenu
            deleteItem={handleDelete}
            deleteText={`Are you sure want to delete ${discussion.title} discussion? this process can't be undone.`}
            deleteTitle='Delete Discussion'
            editLink={`/projects/${selectedProject?._id}/discussions/${discussion._id}/edit`}
          >
            <HorizIcon fontSize='large' />
          </CardMenu>
        </MenuContainer>
      )}
    </Container>
  );
};

const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, AnyAction>) => ({
  deleteDiscussion: (projectId: string, discussionId: string) =>
    dispatch(deleteDiscussion(projectId, discussionId)),
});

const Container = styled.div`
  position: relative;
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  outline: none;
`;

const Card = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 15px 0;
  width: 100%;
  padding: 15px;
  background-color: ${setColor.mainWhite};
  box-shadow: ${setShadow.main};
  transition: 0.2s ease-in-out;
  cursor: pointer;
  user-select: none;
  border-radius: 8px;
  &:hover {
    box-shadow: ${setShadow.hover};
  }
  &:active {
    box-shadow: ${setShadow.main};
  }
`;

const ContainerLeft = styled.div`
  display: flex;
  align-items: center;
  color: ${setColor.primaryDark};
  span {
    font-weight: 500;
    margin-left: 5px;
  }
  h4 {
    margin-left: 10px;
    font-weight: 600;
    color: ${setColor.mainBlack};
  }
`;

const ContainerRight = styled.div`
  color: ${setColor.mainBlack};
  span {
    font-size: ${setRem(14)};
    justify-items: flex-end;
    font-weight: 500;
    margin-right: 55px;
  }
`;

const MenuContainer = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  margin-right: 25px;
  margin-top: 11px;
  cursor: pointer;
`;

const HorizIcon = styled(MoreHorizOutlinedIcon)`
  color: ${setColor.lightBlack};
  &:hover {
    transition: 0.2s ease-in-out;
    color: ${setColor.mainBlack};
  }
  &:active {
    color: ${setColor.lightBlack};
  }
`;

export default connect(null, mapDispatchToProps)(DiscussionCard);
