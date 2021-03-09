import React from 'react';
import styled from 'styled-components';
import dayjs from 'dayjs';

import { setColor, setRem, setShadow } from '../../styles';
import Avatar from '../global/Avatar';
import avatar from '../../assets/profile-picture.png';
import MessageOutlinedIcon from '@material-ui/icons/MessageOutlined';
import { CommitTypes } from '../../actions/githubTypes';

interface GithubCardProps {
  commit?: CommitTypes;
}

const GithubCard: React.FC<GithubCardProps> = ({ commit }) => {
  return (
    <Container
      href={commit?.html_url}
      target='_blank'
      rel='noopener noreferrer'
    >
      <Avatar
        size='40'
        src={commit?.committer.avatar_url ?? avatar}
        alt='avatar'
      />
      <ContentContainer>
        <h4>{commit?.commit.message}</h4>
        <BottomContainer>
          <span>{commit?.commit.committer.name}</span>
          <span>
            Commited on{' '}
            {dayjs(commit?.commit.committer.date).format('DD MMM YYYY')}
          </span>
        </BottomContainer>
      </ContentContainer>
      <CommentContainer>
        <span>{commit?.commit.comment_count}</span> <MessageOutlinedIcon />
      </CommentContainer>
    </Container>
  );
};

const Container = styled.a`
  display: flex;
  align-items: center;
  text-decoration: none;
  color: ${setColor.mainBlack};
  background-color: ${setColor.mainWhite};
  width: 100%;
  padding: 15px;
  box-shadow: ${setShadow.main};
  transition: 0.2s ease-in-out;
  cursor: pointer;
  user-select: none;
  border-radius: 8px;
  margin: 15px 0;
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
