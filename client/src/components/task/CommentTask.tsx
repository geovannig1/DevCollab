import React, { useState, Fragment } from 'react';
import styled from 'styled-components';

import SendIcon from '@material-ui/icons/Send';
import { RoundedButton } from '../global/Button';
import { setColor, setRem } from '../../styles';
import Avatar from '../global/Avatar';
import avatar from '../../assets/profile-picture.png';
import socket from '../../utils/socketio';
import { UserType } from '../../actions/authTypes';
import { Comment as IComment, Member } from '../../actions/taskTypes';
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

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
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

  //Handle the submit from the textarea
  const handleUserKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
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
    }
  };

  return (
    <Fragment>
      {signedInMember?.accessPermission !== AccessPermission.ReadOnly && (
        <form onSubmit={handleSubmit}>
          <InputComment>
            <Avatar size='40' src={user?.avatar?.url ?? avatar} alt='profile' />
            <textarea
              name='comment'
              placeholder='Write a comment...'
              autoComplete='off'
              onChange={handleChange}
              value={commentData}
              onKeyPress={handleUserKeyPress}
            />
            <RoundedButton size='45'>
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
  textarea {
    border: 1px solid ${setColor.lightBlack};
    height: 50px;
    outline: none;
    padding: 15px;
    border-radius: 5px;
    resize: none;
    font-size: ${setRem(14)};
    &:focus {
      border-color: ${setColor.primary};
    }
  }
`;

const CommentContainer = styled.div`
  min-height: 100px;
`;

export default CommentTask;
