import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';

import { ActivityTypes } from '../../actions/activityTypes';
import { UserType } from '../../actions/authTypes';
import ActivityMessage from './ActivityMessage';

interface ActivityContentProps {
  projectId: string;
  activity?: ActivityTypes;
  user?: UserType;
}

const ActivityContent: React.FC<ActivityContentProps> = ({
  projectId,
  activity,
  user,
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
    <Container>
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

const Container = styled.div`
  overflow-y: auto;
  height: 60vh;
  padding: 10px 0;
`;

export default ActivityContent;
