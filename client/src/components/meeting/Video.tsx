import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

import { MeetingTypes } from '../../actions/meetingTypes';
import { IPeers } from './PeerTypes';
import { StyledVideo, StyledVideoContainer } from './StyledVideo';
import MicOffIcon from '@material-ui/icons/MicOff';
import { setColor } from '../../styles';
import socket from '../../utils/socketio';
import { UserType } from '../../actions/authTypes';

interface VideoProps {
  peer: IPeers;
  selectedMeeting: MeetingTypes;
}

const Video: React.FC<VideoProps> = ({
  peer: { peer, peerId },
  selectedMeeting,
}) => {
  const ref = useRef<HTMLVideoElement>(null);
  const [mute, setMute] = useState(false);

  useEffect(() => {
    peer.on('stream', (stream) => {
      if (ref.current) ref.current.srcObject = stream;
    });

    socket.on('user audio', (data: { mute: boolean; userId: string }) => {
      if (peerId === data.userId) {
        setMute(!data.mute);
      }
    });
  }, [peer, peerId]);

  //Find user name
  const userName = selectedMeeting.members.find(
    (member) => member.user._id === peerId
  );

  return (
    <StyledVideoContainer>
      <StyledVideo width='420' height='200' playsInline autoPlay ref={ref} />
      <span>
        {mute && <MicOffIcon fontSize='small' />}
        {userName?.user.firstName} {userName?.user.lastName}
      </span>
    </StyledVideoContainer>
  );
};

export default Video;
