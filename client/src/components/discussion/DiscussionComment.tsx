import React, { Fragment, useState, useEffect } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';

import SendIcon from '@material-ui/icons/Send';
import Avatar from '../global/Avatar';
import { RoundedButton } from '../global/Button';
import avatar from '../../assets/profile-picture.png';
import { UserType } from '../../actions/authTypes';
import { setColor, setRem } from '../../styles';
import socket from '../../utils/socketio';
import { receiveComment } from '../../actions/discussionActions';
import { DiscussionType } from '../../actions/discussionTypes';
import Comment from '../global/Comment';
import { AccessPermission, ProjectType } from '../../actions/projectTypes';

interface DiscussionCommentProps {
  user?: UserType;
  receiveComment: (commentData: DiscussionType) => void;
  selectedDiscussion: DiscussionType;
  selectedProject?: ProjectType;
}

const DiscussionComment: React.FC<DiscussionCommentProps> = ({
  user,
  receiveComment,
  selectedDiscussion,
  selectedProject,
}) => {
  const [commentData, setCommentData] = useState('');

  useEffect(() => {
    socket.on('receive discussion comment', (data: DiscussionType) => {
      receiveComment(data);
    });
  }, [receiveComment]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCommentData(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (commentData.trim() !== '') {
      socket.emit('send discussion comment', {
        projectId: selectedProject?._id,
        discussionId: selectedDiscussion._id,
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
        socket.emit('send discussion comment', {
          projectId: selectedProject?._id,
          discussionId: selectedDiscussion._id,
          userId: user?._id,
          commentData,
        });
        setCommentData('');
      }
    }
  };

  //Find user in the project
  const findUser = selectedProject?.members?.find(
    (member) => member.user._id === user?._id
  );

  return (
    <Fragment>
      {findUser?.accessPermission !== AccessPermission.ReadOnly && (
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
        {selectedDiscussion.comments?.map((comment) => (
          <Comment
            key={comment._id}
            comment={comment}
            projectId={selectedProject?._id ?? ''}
            itemId={selectedDiscussion._id ?? ''}
            user={user}
            socketName='delete discussion comment'
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
  textarea {
    width: 400px;
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

export default connect(null, mapDispatchToProps)(DiscussionComment);
