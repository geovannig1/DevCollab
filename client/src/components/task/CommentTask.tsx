import React from 'react';
import styled from 'styled-components';

import SendIcon from '@material-ui/icons/Send';
import { RoundedButton } from '../global/Button';
import { setColor } from '../../styles';
import Avatar from '../global/Avatar';
import avatar from '../../assets/profile-picture.png';

interface CommentTaskProps {
  userAvatar?: string;
}

const handleSubmitComment = (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
};

const CommentTask: React.FC<CommentTaskProps> = ({ userAvatar }) => {
  return (
    <form onSubmit={handleSubmitComment}>
      <InputComment>
        <Avatar size='40' src={userAvatar ?? avatar} alt='profile' />
        <input
          type='text'
          name='comment'
          placeholder='Write a comment...
'
        />
        <RoundedButton size='40'>
          <SendIcon fontSize='small' />
        </RoundedButton>
      </InputComment>
      <Comments></Comments>
    </form>
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

const Comments = styled.div`
  min-height: 100px;
`;

export default CommentTask;
