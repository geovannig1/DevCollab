import React from 'react';
import styled from 'styled-components';

import { setColor, setRem, setShadow } from '../../styles';
import Avatar from '../global/Avatar';
import avatar from '../../assets/profile-picture.png';
import MessageOutlinedIcon from '@material-ui/icons/MessageOutlined';

interface GithubCardProps {}

const GithubCard: React.FC<GithubCardProps> = ({}) => {
  return (
    <Container>
      <Avatar size='40' src={avatar} alt='avatar' />
      <ContentContainer>
        <h4>Commit Name</h4>
        <BottomContainer>
          <span>John Doe</span>
          <span>Commited on 13 Jan 2021</span>
        </BottomContainer>
      </ContentContainer>
      <CommentContainer>
        <span>5</span> <MessageOutlinedIcon />
      </CommentContainer>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  align-items: center;
  background-color: ${setColor.mainWhite};
  width: 100%;
  padding: 15px;
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

const ContentContainer = styled.div`
  margin-left: 5px;
  h4 {
    font-weight: 600;
  }
`;

const BottomContainer = styled.div`
  display: flex;
  align-items: center;
  span {
    font-weight: 500;
    font-size: ${setRem(15)};
  }
  span:last-child {
    color: ${setColor.mediumBlack};
    margin-left: 10px;
    font-weight: 400;
    font-size: ${setRem(13)};
  }
`;

const CommentContainer = styled.div`
  margin-left: auto;
  color: ${setColor.primaryDark};
  display: flex;
  align-items: center;
  span {
    margin: 0 5px;
  }
`;

export default GithubCard;
