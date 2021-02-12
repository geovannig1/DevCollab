import React, { Fragment, useState, useEffect } from 'react';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';
import { connect } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';

import SendIcon from '@material-ui/icons/Send';
import Avatar from '../global/Avatar';
import { RoundedButton } from '../global/Button';
import avatar from '../../assets/profile-picture.png';
import { UserType } from '../../actions/authTypes';
import { setColor } from '../../styles';
import socket from '../../utils/socketio';
import { receiveComment } from '../../actions/discussionActions';
import { DiscussionType } from '../../actions/discussionTypes';
import Comment from '../global/Comment';

interface DiscussionCommentProps {
  user?: UserType;
  receiveComment: (commentData: DiscussionType) => void;
  selectedDiscussion: DiscussionType;
}

const DiscussionComment: React.FC<DiscussionCommentProps> = ({
  user,
  receiveComment,
  selectedDiscussion,
}) => {
  const { discussionId, projectId } = useParams<{
    discussionId: string;
    projectId: string;
  }>();
  const [commentData, setCommentData] = useState('');

  useEffect(() => {
    socket.on('receive discussion comment', (data: DiscussionType) => {
      receiveComment(data);
    });
  }, [receiveComment]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCommentData(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (commentData.trim() !== '') {
      socket.emit('send discussion comment', {
        projectId,
        discussionId,
        userId: user?._id,
        commentData,
      });
      setCommentData('');
    }
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

      <CommentContainer>
        {selectedDiscussion.comments?.map((comment) => (
          <Comment
            key={comment._id}
            comment={comment}
            projectId=''
            itemId=''
            user={user}
          />
        ))}
      </CommentContainer>
    </Fragment>
  );
};

const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, AnyAction>) => ({
  receiveComment: (commentData: DiscussionType) =>
    dispatch(receiveComment(commentData)),
});

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

export default connect(null, mapDispatchToProps)(DiscussionComment);
