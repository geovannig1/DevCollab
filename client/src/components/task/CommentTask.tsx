import React, { useState, Fragment } from 'react';
import styled from 'styled-components';

import SendIcon from '@material-ui/icons/Send';
import { RoundedButton } from '../global/Button';
import { setColor } from '../../styles';
import Avatar from '../global/Avatar';
import avatar from '../../assets/profile-picture.png';
import socket from '../../utils/socketio';
import { UserType } from '../../actions/authTypes';
import { Comment as IComment, Member } from './taskTypes';
import Comment from '../global/Comment';
import { AccessPermission } from '../../actions/projectTypes';

interface CommentTaskProps {
  user?: UserType;
  taskId: string;
  projectId: string;
  comments?: IComment[];
  signedInMember?: Member;
}

const CommentTask: React.FC<CommentTaskProps> = ({
  user,
  taskId,
  projectId,
  comments,
  signedInMember,
}) => {
  const [commentData, setCommentData] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCommentData(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (commentData.trim() !== '') {
      socket.emit('send task comment', {
        projectId,
        taskId,
        userId: user?._id,
        commentData,
      });
      setCommentData('');
    }
  };

  return (
    <Fragment>
      {signedInMember?.accessPermission !== AccessPermission.ReadOnly && (
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
      )}

      <CommentContainer>
        {comments?.map((comment) => (
          <Comment
            key={comment._id}
            comment={comment}
            projectId={projectId}
            itemId={taskId}
            user={user}
            socketName='delete task comment'
          />
        ))}
      </CommentContainer>
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

export default CommentTask;
