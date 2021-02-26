import React, { Fragment } from 'react';
import styled from 'styled-components';

import { setColor, setRem } from '../../styles';
import MicIcon from '@material-ui/icons/Mic';
import MicOffIcon from '@material-ui/icons/MicOff';
import VideocamIcon from '@material-ui/icons/Videocam';
import CallIcon from '@material-ui/icons/Call';
import VideocamOffIcon from '@material-ui/icons/VideocamOff';
import ScreenShareIcon from '@material-ui/icons/ScreenShare';

interface ControllerProps {
  projectId: string;
  mute: boolean;
  cameraDisable: boolean;
  setAudio: () => void;
  setVideo: () => void;
  shareScreen: () => Promise<void>;
}

const Controller: React.FC<ControllerProps> = ({
  projectId,
  mute,
  cameraDisable,
  setAudio,
  setVideo,
  shareScreen,
}) => {
  const handleMute = () => {
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

      <IconContainer color={setColor.secondary} onClick={shareScreen}>
        <ScreenShareIcon fontSize='large' />
        <span>Share Screen</span>
      </IconContainer>

      <StyledLink href={`/projects/${projectId}/meeting-rooms`}>
        <IconContainer color={setColor.mainRed}>
          <CallIcon fontSize='large' />
          <span>Leave Meeting</span>
        </IconContainer>
      </StyledLink>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  position: relative;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 10vh;
  background-color: ${setColor.mainBlack};
`;

const LeftContainer = styled.div`
  display: flex;
  height: 100%;
`;

const IconContainer = styled.div<{ color?: string }>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: ${({ color }) => color ?? setColor.mainGrey};
  cursor: pointer;
  transition: 0.3s ease-in-out;
  border-radius: 8px;
  user-select: none;
  height: 100%;
  width: 130px;
  padding: 0 10px;
  span {
    font-weight: 400;
    font-size: ${setRem(14)};
  }
  &:hover {
    background-color: ${setColor.mediumBlack};
  }
`;

const StyledLink = styled.a`
  display: flex;
  justify-content: flex-end;
  text-decoration: none;
  height: 100%;
  width: 260px;
  user-select: none;
  outline: none;
`;

export default Controller;
