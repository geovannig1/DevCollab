import React, { useEffect, useRef } from 'react';
import Peer from 'simple-peer';
import styled from 'styled-components';

interface VideoProps {
  peer: Peer.Instance;
}

const Video: React.FC<VideoProps> = ({ peer }) => {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    peer.on('stream', (stream) => {
      if (ref.current) ref.current.srcObject = stream;
    });
  }, []);

  return <StyledVideo playsInline autoPlay ref={ref} />;
};

const StyledVideo = styled.video`
  height: 40%;
  width: 50%;
`;

export default Video;
