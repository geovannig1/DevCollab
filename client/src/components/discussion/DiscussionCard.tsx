import React from 'react';
import styled from 'styled-components';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Link } from 'react-router-dom';

import { setColor, setShadow, setRem } from '../../styles';
import CommentOutlinedIcon from '@material-ui/icons/CommentOutlined';
import MoreHorizOutlinedIcon from '@material-ui/icons/MoreHorizOutlined';
import { DiscussionType } from '../../actions/discussionTypes';
import CardMenu from '../global/CardMenu';

interface DiscussionCardProps {
  discussion: DiscussionType;
  totalDiscussions: number;
  projectId: string;
}

const DiscussionCard: React.FC<DiscussionCardProps> = ({
  discussion,
  totalDiscussions,
  projectId,
}) => {
  //Extend dayjs with relativeTime
  dayjs.extend(relativeTime);

  return (
    <Container>
      <StyledLink to={`/projects/${projectId}/discussions/${discussion._id}`}>
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

      <MenuContainer>
        <CardMenu
          deleteItem={() => {}}
          deleteText={`Are you sure want to delete ${discussion.title} discussion? this process can't be undone.`}
          deleteTitle='Delete Discussion'
          editLink={`/projects/${projectId}/discussions/${discussion._id}/edit`}
        >
          <HorizIcon fontSize='large' />
        </CardMenu>
      </MenuContainer>
    </Container>
  );
};

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

export default DiscussionCard;
