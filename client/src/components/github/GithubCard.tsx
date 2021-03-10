import React, { Fragment } from 'react';
import styled from 'styled-components';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

import { setColor, setRem, setShadow } from '../../styles';
import Avatar from '../global/Avatar';
import avatar from '../../assets/profile-picture.png';
import MessageOutlinedIcon from '@material-ui/icons/MessageOutlined';
import { CommitTypes, PullTypes } from '../../actions/githubTypes';

interface GithubCardProps {
  commit?: CommitTypes;
  pull?: PullTypes;
}

const GithubCard: React.FC<GithubCardProps> = ({ commit, pull }) => {
  //Extends dayjs with relativeTime
  dayjs.extend(relativeTime);

  return (
    <Container
      href={commit?.html_url ?? pull?.html_url}
      target='_blank'
      rel='noopener noreferrer'
    >
      <Avatar
        size='40'
        src={commit?.author.avatar_url ?? pull?.user.avatar_url ?? avatar}
        alt='avatar'
      />
      <ContentContainer>
        <Title>
          <h4>{commit?.commit.message ?? pull?.title}</h4>
          {pull && <span>{dayjs(pull?.updated_at).fromNow()}</span>}
        </Title>

        {pull && (
          <Info>
            <b>{pull.user.login}</b> wants to merge commits into{' '}
            <strong>{pull?.base.label}</strong> from{' '}
            <strong>{pull?.head.label}</strong>
          </Info>
        )}
        <BottomContainer>
          {commit && (
            <Fragment>
              <span>{commit?.commit.author.name ?? pull?.user.login}</span>

              <span>
                Commited {dayjs(commit?.commit.author.date).fromNow()}
              </span>
            </Fragment>
          )}
        </BottomContainer>
      </ContentContainer>

      {commit && (
        <CommentContainer>
          <span>{commit?.commit.comment_count}</span> <MessageOutlinedIcon />
        </CommentContainer>
      )}
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

const Title = styled.div`
  display: flex;
  span {
    color: ${setColor.mediumBlack};
    margin-left: 10px;
    font-weight: 400;
    font-size: ${setRem(13)};
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
    margin-left: 5px;
    font-weight: 400;
    font-size: ${setRem(13)};
  }
`;

const Info = styled.span`
  font-size: ${setRem(14)};
  b {
    font-weight: 500;
  }
  strong {
    font-weight: 500;
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
