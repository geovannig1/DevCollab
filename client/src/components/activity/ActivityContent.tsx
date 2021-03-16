import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';

import { ActivityTypes } from '../../actions/activityTypes';
import { UserType } from '../../actions/authTypes';
import ActivityMessage from './ActivityMessage';

interface ActivityContentProps {
  projectId: string;
  activity?: ActivityTypes;
  user?: UserType;
  size?: string;
}

const ActivityContent: React.FC<ActivityContentProps> = ({
  projectId,
  activity,
  user,
  size,
}) => {
  const messagesEndRef = useRef<HTMLInputElement>(null);

  //Function to scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activity?.messages]);

  return (
    <Container size={size}>
      {activity?.messages.map((message) => (
        <ActivityMessage
          key={message._id}
          message={message}
          user={user}
          projectId={projectId}
        />
      ))}
      <div ref={messagesEndRef} />
    </Container>
  );
};

const Container = styled.div<{ size?: string }>`
  overflow-y: auto;
  height: ${({ size }) => size ?? '58'}vh;
  padding: 10px 0;
`;

export default ActivityContent;
