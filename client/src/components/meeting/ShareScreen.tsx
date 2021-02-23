import React, { Fragment, useEffect, useRef } from 'react';

import { StyledShareScreen } from './StyledVideo';
import { IPeers } from './PeerTypes';

interface ShareScreenProps {
  peer: IPeers;
}

const ShareScreen: React.FC<ShareScreenProps> = ({ peer: { peer } }) => {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    peer?.on('stream', (stream) => {
      if (ref.current) ref.current.srcObject = stream;
    });
  }, [peer]);

  return (
    <Fragment>
      <StyledShareScreen playsInline autoPlay ref={ref} controls />
    </Fragment>
  );
};

export default ShareScreen;
