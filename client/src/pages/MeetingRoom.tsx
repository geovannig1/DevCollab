import React, { useEffect, useRef, useState, Fragment } from 'react';
import { connect } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';
import { useParams } from 'react-router-dom';
import Peer from 'simple-peer';
import { Socket } from 'socket.io-client';
import styled from 'styled-components';

import { Store } from '../store';
import { loadMeeting } from '../actions/meetingActions';
import { MeetingInitialState } from '../reducers/meetingReducer';
import socket from '../utils/socketio';
import { AuthInitialState } from '../reducers/authReducer';
import Video from '../components/meeting/Video';
import {
  StyledVideo,
  StyledVideoContainer,
} from '../components/meeting/StyledVideo';
import { setColor } from '../styles';
import Controller from '../components/meeting/Controller';
import { ReactComponent as Logo } from '../assets/logo-white.svg';
import { IPeers } from '../components/meeting/PeerTypes';
import MicOffIcon from '@material-ui/icons/MicOff';

interface MeetingRoomProps {
  meeting: MeetingInitialState;
  auth: AuthInitialState;
  loadMeeting: (projectId: string, meetingId: string) => Promise<void>;
}

const MeetingRoom: React.FC<MeetingRoomProps> = ({
  meeting: { selectedMeeting },
  loadMeeting,
  auth: { user },
}) => {
  const { projectId, meetingId } = useParams<{
    projectId: string;
    meetingId: string;
  }>();

  useEffect(() => {
    document.title = 'Meeting Room | DevCollab';
    loadMeeting(projectId, meetingId);
  }, [loadMeeting, projectId, meetingId]);

  const videoConstraints = {
    height: window.innerHeight / 2,
    width: window.innerWidth / 2,
  };

  const [videoPeers, setVideoPeers] = useState<IPeers[]>([]);
  const socketRef = useRef<Socket>();
  const userVideo = useRef<HTMLVideoElement>(null);
  const peersRef = useRef<IPeers[]>([]);

  useEffect(() => {
    //Render only after selectedMeeting exist
    if (selectedMeeting) {
      socketRef.current = socket;

      navigator.mediaDevices
        .getUserMedia({
          video: videoConstraints,
          audio: true,
        })
        .then((stream) => {
          if (userVideo.current) userVideo.current.srcObject = stream;

          //Join the meeting room
          socketRef.current?.emit('join room', {
            meetingId,
            userId: user?._id,
          });

          //Get the other user data for the current user
          socketRef.current?.on('all users', (users: any) => {
            const peers: IPeers[] = [];

            users.forEach((userId: string) => {
              const peer = createPeer(userId, user?._id ?? '', stream);

              peersRef.current.push({ peerId: userId, peer });

              peers.push({ peerId: userId, peer });
            });

            setVideoPeers(peers);
          });

          //Receive offer from other user
          socketRef.current?.on('user joined', (data: any) => {
            const peer = addPeer(data.signal, data.callerId, stream);
            peersRef.current.push({ peerId: data.callerId, peer });
            const peerObj = {
              peerId: data.callerId,
              peer,
            };

            setVideoPeers([...videoPeers, peerObj]);
          });

          //Receive answer from other
          socketRef.current?.on('receiving returned signal', (data: any) => {
            const item = peersRef.current.find((p) => p.peerId === data.id);
            item?.peer.signal(data.signal);
          });

          //Handle user left from meeting
          socketRef.current?.on('user left', (id: string) => {
            const peerObj = peersRef.current.find((p) => p.peerId === id);

            if (peerObj) {
              peerObj.peer.destroy();
            }
            const peers = peersRef.current.filter((p) => p.peerId !== id);

            peersRef.current = peers;

            setVideoPeers(peers);
          });
        });
    }
  }, []);

  //Function to create a new peer
  function createPeer(
    userToSignal: string,
    callerId: string,
    stream: MediaStream
  ) {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream,
    });

    peer.on('signal', (signal) => {
      //sending offer
      socketRef.current?.emit('sending signal', {
        userToSignal,
        callerId,
        signal,
      });
    });

    return peer;
  }

  //Function to add a peer
  function addPeer(
    incomingSignal: string,
    callerId: string,
    stream: MediaStream
  ) {
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream,
    });

    peer.on('signal', (signal) => {
      socketRef.current?.emit('returning signal', {
        signal,
        callerId,
        userId: user?._id,
      });
    });

    peer.signal(incomingSignal);

    return peer;
  }

  const [mute, setMute] = useState(false);
  const setAudio = () => {
    const mediaStream: any = userVideo.current?.srcObject;
    const enabled = mediaStream?.getAudioTracks()[0].enabled;
    setMute(mediaStream.getAudioTracks()[0].enabled);

    if (enabled) {
      mediaStream.getAudioTracks()[0].enabled = false;
    } else {
      mediaStream.getAudioTracks()[0].enabled = true;
    }
  };

  const [cameraDisable, setCameraDisable] = useState(false);
  const setVideo = () => {
    const mediaStream: any = userVideo.current?.srcObject;
    const enabled = mediaStream?.getVideoTracks()[0].enabled;
    setCameraDisable(mediaStream.getVideoTracks()[0].enabled);

    if (enabled) {
      mediaStream.getVideoTracks()[0].enabled = false;
    } else {
      mediaStream.getVideoTracks()[0].enabled = true;
    }
  };

  return (
    <Fragment>
      {selectedMeeting && (
        <Container>
          <StyledLogo />
          <VideoContainer>
            <StyledVideoContainer>
              <StyledVideo
                width='420'
                height='200'
                muted
                ref={userVideo}
                autoPlay
                playsInline
              />
              <span>
                {mute && <MicOffIcon fontSize='small' />}
                {user?.firstName} {user?.lastName}
              </span>
            </StyledVideoContainer>
            {videoPeers.map((peer) => (
              <Video
                key={peer.peerId}
                selectedMeeting={selectedMeeting}
                peer={peer}
              />
            ))}
          </VideoContainer>

          <Controller
            projectId={projectId}
            mute={mute}
            cameraDisable={cameraDisable}
            setAudio={setAudio}
            setVideo={setVideo}
            user={user}
          />
        </Container>
      )}
    </Fragment>
  );
};

const mapStateToProps = (state: Store) => ({
  meeting: state.meeting,
  auth: state.auth,
});

const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, AnyAction>) => ({
  loadMeeting: (projectId: string, meetingId: string) =>
    dispatch(loadMeeting(projectId, meetingId)),
});

const Container = styled.div`
  background-color: ${setColor.mainBlack};
`;

const StyledLogo = styled(Logo)`
  width: 150px;
  height: 50px;
  position: absolute;
  top: 10px;
  left: 10px;
  user-select: none;
`;

const VideoContainer = styled.div`
  padding: 20px;
  display: flex;
  justify-content: center;

  flex-wrap: wrap;
  height: 90vh;
`;

export default connect(mapStateToProps, mapDispatchToProps)(MeetingRoom);
