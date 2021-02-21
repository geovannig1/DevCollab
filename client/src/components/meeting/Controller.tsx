import React, { Fragment, useState } from 'react';
import styled from 'styled-components';

import { setColor, setRem } from '../../styles';
import MicIcon from '@material-ui/icons/Mic';
import MicOffIcon from '@material-ui/icons/MicOff';
import VideocamIcon from '@material-ui/icons/Videocam';
import CallIcon from '@material-ui/icons/Call';
import socket from '../../utils/socketio';
import { UserType } from '../../actions/authTypes';
import VideocamOffIcon from '@material-ui/icons/VideocamOff';

interface ControllerProps {
  user?: UserType;
  projectId: string;
  mute: boolean;
  cameraDisable: boolean;
  setAudio: () => void;
  setVideo: () => void;
}

const Controller: React.FC<ControllerProps> = ({
  user,
  projectId,
  mute,
  cameraDisable,
  setAudio,
  setVideo,
}) => {
  const handleMute = () => {
    socket.emit('send audio', { mute, userId: user?._id });
    setAudio();
  };

  const handleCamera = () => {
    setVideo();
  };

  return (
    <Container>
      <LeftContainer>
        <IconContainer onClick={handleMute}>
          {mute ? (
            <Fragment>
              <MicOffIcon fontSize='large' />
              <span>Unmute</span>
            </Fragment>
          ) : (
            <Fragment>
              <MicIcon fontSize='large' />
              <span>Mute</span>
            </Fragment>
          )}
        </IconContainer>
        <IconContainer onClick={handleCamera}>
          {cameraDisable ? (
            <Fragment>
              <VideocamOffIcon fontSize='large' />
              <span>Start Video</span>
            </Fragment>
          ) : (
            <Fragment>
              <VideocamIcon fontSize='large' />
              <span>Stop Video</span>
            </Fragment>
          )}
        </IconContainer>
      </LeftContainer>

      <StyledLink href={`/projects/${projectId}/meeting-rooms`}>
        <IconContainer leave>
          <CallIcon fontSize='large' />
          <span>Leave Meeting</span>
        </IconContainer>
      </StyledLink>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  height: 10vh;
`;

const LeftContainer = styled.div`
  display: flex;
`;

const IconContainer = styled.div<{ leave?: boolean }>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 5px 10px;
  padding: 0 20px;
  color: ${({ leave }) => (leave ? setColor.mainRed : setColor.mainGrey)};
  cursor: pointer;
  transition: 0.3s ease-in-out;
  border-radius: 8px;
  user-select: none;
  span {
    font-weight: 400;
    font-size: ${setRem(14)};
  }
  &:hover {
    background-color: ${setColor.mediumBlack};
  }
`;

const StyledLink = styled.a`
  text-decoration: none;
`;

export default Controller;
