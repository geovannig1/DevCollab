import React from 'react';
import styled from 'styled-components';

import { setColor, setShadow } from '../../styles';
import CommentOutlinedIcon from '@material-ui/icons/CommentOutlined';
import MoreHorizOutlinedIcon from '@material-ui/icons/MoreHorizOutlined';

interface DiscussionCardProps {}

const DiscussionCard: React.FC<DiscussionCardProps> = ({}) => {
  return (
    <Container>
      <ContainerContent>
        <CommentOutlinedIcon />
        <span>5</span>
        <h5>Discussion Name</h5>
      </ContainerContent>
      <MoreHorizOutlinedIcon />
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 15px 0;
  width: 100%;
  padding: 10px 15px;
  background-color: ${setColor.lightGrey};
  border: 1px solid ${setColor.mainGrey};
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

const ContainerContent = styled.div`
  display: flex;
  align-items: center;
  span {
    font-weight: 500;
    margin-left: 5px;
  }
  h5 {
    margin-left: 10px;
  }
`;

export default DiscussionCard;
