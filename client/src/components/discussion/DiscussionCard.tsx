import React from 'react';
import styled from 'styled-components';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Link } from 'react-router-dom';

import { setColor, setShadow, setRem } from '../../styles';
import CommentOutlinedIcon from '@material-ui/icons/CommentOutlined';
import MoreHorizOutlinedIcon from '@material-ui/icons/MoreHorizOutlined';
import { DiscussionType } from '../../actions/discussionTypes';

interface DiscussionCardProps {
  discussion: DiscussionType;
  totalDiscussions: string;
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
    <StyledLink to={`/projects/${projectId}/discussions/${discussion._id}`}>
      <Container>
        <ContainerLeft>
          <CommentOutlinedIcon />
          <span>{totalDiscussions}</span>
          <h4>{discussion.title}</h4>
        </ContainerLeft>
        <ContainerRight>
          <span>{dayjs(discussion.date).fromNow()}</span>
          <MoreHorizOutlinedIcon />
        </ContainerRight>
      </Container>
    </StyledLink>
  );
};

const StyledLink = styled(Link)`
  text-decoration: none;
  outline: none;
`;

const Container = styled.div`
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
  display: flex;
  align-items: center;
  color: ${setColor.mainBlack};
  span {
    font-size: ${setRem(14)};
    justify-items: flex-end;
    font-weight: 500;
    margin: 0 15px;
  }
`;

export default DiscussionCard;
