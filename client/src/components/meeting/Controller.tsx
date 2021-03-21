import React, { Fragment } from 'react';
import styled from 'styled-components';

import { media, setColor, setRem } from '../../styles';
import MicIcon from '@material-ui/icons/Mic';
import MicOffIcon from '@material-ui/icons/MicOff';
import VideocamIcon from '@material-ui/icons/Videocam';
import CallIcon from '@material-ui/icons/Call';
import VideocamOffIcon from '@material-ui/icons/VideocamOff';
import ScreenShareIcon from '@material-ui/icons/ScreenShare';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

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
  const classes = useStyles();

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
              <MicOffIcon className={classes.icon} />
              <span>Unmute</span>
            </Fragment>
          ) : (
            <Fragment>
              <MicIcon className={classes.icon} />
              <span>Mute</span>
            </Fragment>
          )}
        </IconContainer>
        <IconContainer onClick={handleCamera}>
          {cameraDisable ? (
            <Fragment>
              <VideocamOffIcon className={classes.icon} />
              <span>Start Video</span>
            </Fragment>
          ) : (
            <Fragment>
              <VideocamIcon className={classes.icon} />
              <span>Stop Video</span>
            </Fragment>
          )}
        </IconContainer>
      </LeftContainer>

      <IconContainer color={setColor.secondary} onClick={shareScreen}>
        <ScreenShareIcon className={classes.icon} />
        <span>Share Screen</span>
      </IconContainer>

      <StyledLink href={`/projects/${projectId}/meeting-rooms`}>
        <IconContainer color={setColor.mainRed}>
          <CallIcon className={classes.icon} />
          <span>Leave Meeting</span>
        </IconContainer>
      </StyledLink>
    </Container>
  );
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    icon: {
      fontSize: 30,
      [theme.breakpoints.down('xs')]: {
        fontSize: 25,
      },
    },
  })
);

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
  text-align: center;
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

    @media ${media.sm} {
      font-size: ${setRem(10)};
    }
  }
  &:hover {
    background-color: ${setColor.mediumBlack};
  }

  @media ${media.sm} {
    width: 100px;
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
