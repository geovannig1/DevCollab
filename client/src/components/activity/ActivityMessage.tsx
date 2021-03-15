import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import avatar from '../../assets/profile-picture.png';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import ReactMarkdown from 'react-markdown';

import { setColor, setRem, setShadow } from '../../styles';
import Avatar from '../global/Avatar';
import AlertDialog from '../global/AlertDialog';
import { ActivityAvatar, Message } from '../../actions/activityTypes';
import { UserType } from '../../actions/authTypes';
import socket from '../../utils/socketio';
import discussionActivity from '../../assets/discussionActivity.png';
import meetingActivity from '../../assets/meetingActivity.png';
import noteActivity from '../../assets/noteActivity.png';
import fileActivity from '../../assets/fileActivity.png';
import taskActivity from '../../assets/taskActivity.png';

interface ActivityMessageProps {
  projectId: string;
  message: Message;
  user?: UserType;
}

const ActivityMessage: React.FC<ActivityMessageProps> = ({
  projectId,
  message,
  user,
}) => {
  //Extends dayjs
  dayjs.extend(relativeTime);

  const handleDelete = () => {
    socket.emit('delete activity message', {
      projectId,
      messageId: message._id,
    });
  };

  //Handle activity avatar
  const [activityAvatar, setActivityAvatar] = useState('');
  useEffect(() => {
    switch (message.avatar) {
      case ActivityAvatar.discussion:
        setActivityAvatar(discussionActivity);
        break;
      case ActivityAvatar.meeting:
        setActivityAvatar(meetingActivity);
        break;
      case ActivityAvatar.note:
        setActivityAvatar(noteActivity);
        break;
      case ActivityAvatar.file:
        setActivityAvatar(fileActivity);
        break;
      case ActivityAvatar.task:
        setActivityAvatar(taskActivity);
        break;
    }
  }, [message.avatar]);

  return (
    <Container>
      <Avatar
        src={message.user?.avatar?.url || activityAvatar || avatar}
        alt='avatar'
        size='40'
        radiusNone
      />
      <MessageContainer>
        <Header>
          <h5>
            {message.user?.firstName} {message.user?.lastName}
            {message.name}
          </h5>
          <span>{dayjs(message.date).fromNow()}</span>
        </Header>
        <Text>
          <ReactMarkdown>{message.message}</ReactMarkdown>
        </Text>
        {message.user?._id === user?._id && (
          <AlertDialog
            title='Delete Message'
            text="Are you sure want to delete this message? This process can't be undone"
            firstButton='Delete'
            secondButton='Cancel'
            deleteButton
            deleteItem={handleDelete}
          >
            <DeleteButton>Delete</DeleteButton>
          </AlertDialog>
        )}
      </MessageContainer>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 15px;
`;

const MessageContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  display: flex;
  h5 {
    font-weight: 600;
  }
  span {
    margin: 0 10px;
    font-size: ${setRem(12)};
    color: ${setColor.lightBlack};
    font-weight: 500;
  }
`;

const Text = styled.div`
  padding: 10px;
  margin: 3px 0;
  background-color: ${setColor.lightGrey};
  box-shadow: ${setShadow.light};
  align-self: flex-start;
  font-size: ${setRem(15)};
  max-width: 900px;
  strong {
    font-weight: 600;
  }
`;

const DeleteButton = styled.span`
  color: ${setColor.lightBlack};
  font-size: ${setRem(11)};
  text-decoration: underline;
  transition: ease-in-out 0.3s;
  &:hover {
    color: ${setColor.mainBlack};
  }
  &:active {
    color: ${setColor.lightBlack};
  }
`;

export default ActivityMessage;
