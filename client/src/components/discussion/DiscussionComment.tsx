import React, { Fragment, useState } from 'react';
import styled from 'styled-components';

import SendIcon from '@material-ui/icons/Send';
import Avatar from '../global/Avatar';
import { RoundedButton } from '../global/Button';
import avatar from '../../assets/profile-picture.png';
import { UserType } from '../../actions/authTypes';
import { setColor } from '../../styles';

interface DiscussionCommentProps {
  user?: UserType;
}

const DiscussionComment: React.FC<DiscussionCommentProps> = ({ user }) => {
  const [commentData, setCommentData] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCommentData(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(commentData);
    setCommentData('');
  };

  return (
    <Fragment>
      <form onSubmit={handleSubmit}>
        <InputComment>
          <Avatar size='40' src={user?.avatar.url ?? avatar} alt='profile' />
          <input
            type='text'
            name='comment'
            placeholder='Write a comment...'
            autoComplete='off'
            onChange={handleChange}
            value={commentData}
          />
          <RoundedButton size='40'>
            <SendIcon fontSize='small' />
          </RoundedButton>
        </InputComment>
      </form>

      <CommentContainer></CommentContainer>
    </Fragment>
  );
};

const InputComment = styled.div`
  display: flex;
  align-items: center;
  input {
    display: block;
    border-radius: 5px;
    width: 350px;
    height: 40px;
    padding: 15px;
    border: solid ${setColor.lightBlack} 1px;
    outline: none;
    margin-left: 5px;
    &:focus {
      border-color: ${setColor.primary};
    }
  }
`;

const CommentContainer = styled.div`
  min-height: 100px;
`;

export default DiscussionComment;
