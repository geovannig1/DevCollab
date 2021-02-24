import React, { useEffect, useRef, useState, Fragment } from 'react';
import { connect } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';
import { useParams, useHistory } from 'react-router-dom';
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
import ShareScreen from '../components/meeting/ShareScreen';
import {
  createPeer,
  addPeer,
  addPeerScreen,
  createPeerScreen,
} from '../components/meeting/peer';
import { setFullscreen, clearFullscreen } from '../actions/displayActions';

interface MeetingRoomProps {
  meeting: MeetingInitialState;
  auth: AuthInitialState;
  loadMeeting: (projectId: string, meetingId: string) => Promise<void>;
  setFullscreen: (fullscreen: boolean) => void;
  clearFullscreen: () => void;
}

const MeetingRoom: React.FC<MeetingRoomProps> = ({
  meeting: { selectedMeeting, meetingError },
  setFullscreen,
  clearFullscreen,
  loadMeeting,
  auth: { user },
}) => {
  const { projectId, meetingId } = useParams<{
    projectId: string;
    meetingId: string;
  }>();
  const history = useHistory();

  useEffect(() => {
    document.title = 'Meeting Room | DevCollab';
    loadMeeting(projectId, meetingId);

    setFullscreen(true);

    return () => clearFullscreen();
  }, [loadMeeting, projectId, meetingId, setFullscreen, clearFullscreen]);

  //Redirect unauthorized user
  if (meetingError.msg === 'Unauthorized') {
    history.push(`/projects/${projectId}/meeting-rooms`);
  }

  const videoConstraints = {
    width: 420,
    height: 200,
  };

  const [videoPeers, setVideoPeers] = useState<IPeers[]>([]);
  const socketRef = useRef<Socket>();
  const userVideo = useRef<HTMLVideoElement>(null);
  const peersRef = useRef<IPeers[]>([]);
  const [screenPeers, setScreenPeers] = useState<IPeers[]>([]);
  const screenPeersRef = useRef<IPeers[]>([]);
  const screenVideo = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    //Render only after selectedMeeting exist
    if (selectedMeeting) {
      (async () => {
        socketRef.current = socket;

        const stream = await navigator.mediaDevices.getUserMedia({
          video: videoConstraints,
          audio: true,
        });

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
            const peer = createPeer(socketRef, userId, user?._id ?? '', stream);

            peersRef.current.push({ peerId: userId, peer });

            peers.push({ peerId: userId, peer });
          });

          setVideoPeers(peers);
        });

        //Receive offer from other user
        socketRef.current?.on('user joined', (data: any) => {
          const peer = addPeer(
            data.signal,
            data.callerId,
            stream,
            socketRef,
            user
          );
          peersRef.current.push({ peerId: data.callerId, peer });
          const peerObj = {
            peerId: data.callerId,
            peer,
          };

          setVideoPeers([...videoPeers, peerObj]);
        });

        //Receive share screen signal offer from other user
        socketRef.current.on('receive signal screen', (data: any) => {
          const peer = addPeerScreen(
            data.signal,
            data.callerId,
            socketRef,
            user
          );

          screenPeersRef.current.push({ peerId: data.callerId, peer });

          const peerObj = {
            peerId: data.callerId,
            peer,
          };

          setScreenPeers([...screenPeers, peerObj]);
        });

        //Receive answer from other
        socketRef.current?.on('receiving returned signal', (data: any) => {
          const item = peersRef.current.find((p) => p.peerId === data.id);

          item?.peer.signal(data.signal);
        });

        //Receive answer screen from other
        socketRef.current?.on(
          'receiving returned screen signal',
          (data: any) => {
            const item = screenPeersRef.current.find(
              (p) => p.peerId === data.id
            );

            item?.peer.signal(data.signal);
          }
        );

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

        //Remove the displayed share screen
        socketRef.current?.on('share screen ended', () => {
          screenPeersRef.current.forEach((screenPeer) => {
            screenPeer.peer.destroy();
          });
          setScreenPeers([]);
          screenPeersRef.current = [];
        });
      })();
    }
  }, []);

  const [mute, setMute] = useState(false);

  //Send audio condition to other users (muted/not muted)
  useEffect(() => {
    socket.emit('send audio', { mute, userId: user?._id });
  }, [videoPeers, mute]);

  //Mute or unmute the audio
  const setAudio = () => {
    const mediaStream: any = userVideo.current?.srcObject;
    const enabled = mediaStream?.getAudioTracks()?.[0].enabled;
    setMute(mediaStream?.getAudioTracks()?.[0].enabled ?? true);

    if (enabled) {
      mediaStream.getAudioTracks()[0].enabled = false;
    } else {
      if (mediaStream) mediaStream.getAudioTracks()[0].enabled = true;
    }
  };

  const [cameraDisable, setCameraDisable] = useState(false);
  //Turn on or turn off the camera
  const setVideo = () => {
    const mediaStream: any = userVideo.current?.srcObject;

    const enabled = mediaStream?.getVideoTracks()?.[0].enabled;
    setCameraDisable(mediaStream?.getVideoTracks()?.[0].enabled ?? true);

    if (enabled) {
      mediaStream.getVideoTracks()[0].enabled = false;
    } else {
      if (mediaStream) mediaStream.getVideoTracks()[0].enabled = true;
    }
  };

  //Function to share the screen
  const shareScreen = async () => {
    const mediaDevices: any = navigator.mediaDevices;

    //Get the user screen display
    const stream = await mediaDevices.getDisplayMedia({ cursor: true });
    const screenTrack = stream.getVideoTracks()[0];
    if (screenVideo.current) screenVideo.current.srcObject = stream;

    videoPeers.forEach((userPeer) => {
      const peer = createPeerScreen(
        socketRef,
        userPeer.peerId,
        user?._id ?? '',
        stream
      );

      screenPeersRef.current.push({ peerId: userPeer.peerId, peer });
    });

    //When the share screen ended
    screenTrack.onended = () => {
      //emit peer to other users
      videoPeers.forEach((userPeer) => {
        socket.emit('end share screen', userPeer);
      });
      screenPeersRef.current.forEach((screenPeer) => {
        screenPeer.peer.destroy();
      });
      screenPeersRef.current = [];
      if (screenVideo.current) screenVideo.current.srcObject = null;
    };
  };

  return (
    <Fragment>
      {selectedMeeting && (
        <Container>
          <Nav>
            <Logo />
          </Nav>
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

            {/* Only render one share screen */}
            {screenPeers.length > 0 && <ShareScreen peer={screenPeers[0]} />}
          </VideoContainer>

          <Controller
            projectId={projectId}
            mute={mute}
            cameraDisable={cameraDisable}
            setAudio={setAudio}
            setVideo={setVideo}
            shareScreen={shareScreen}
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
  setFullscreen: (fullscreen: boolean) => dispatch(setFullscreen(fullscreen)),
  clearFullscreen: () => dispatch(clearFullscreen()),
});

const Container = styled.div`
  background-color: ${setColor.mainBlack};
  position: relative;
  overflow: hidden;
`;

const Nav = styled.nav`
  width: 100%;
  height: 10vh;
  position: relative;
  background-color: ${setColor.mainBlack};
  svg {
    width: 150px;
    position: absolute;
    top: 5px;
    left: 10px;
    user-select: none;
  }
`;

const VideoContainer = styled.div`
  padding: 20px;
  display: flex;
  justify-content: center;
  overflow-y: auto;
  flex-wrap: wrap;
  height: 80vh;
`;

export default connect(mapStateToProps, mapDispatchToProps)(MeetingRoom);
