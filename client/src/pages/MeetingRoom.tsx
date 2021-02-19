import React, { useEffect, useRef, useState } from 'react';
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

interface IPeers {
  peerId: string;
  peer: Peer.Instance;
}

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

  const [peers, setPeers] = useState<IPeers[]>([]);
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

            setPeers(peers);
          });

          //Receive offer from other user
          socketRef.current?.on('user joined', (data: any) => {
            const peer = addPeer(data.signal, data.callerId, stream);
            peersRef.current.push({ peerId: data.callerId, peer });
            const peerObj = {
              peerId: data.callerId,
              peer,
            };
            setPeers((prevData) => [...prevData, peerObj]);
          });

          //Receive answer from other
          socketRef.current?.on('receiving returned signal', (data: any) => {
            const item = peersRef.current.find((p) => p.peerId === data.id);
            item?.peer.signal(data.signal);
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

  return (
    <div>
      <StyledVideo muted ref={userVideo} autoPlay playsInline />
      {peers.map((peer, index) => (
        <Video key={index} peer={peer.peer} />
      ))}
    </div>
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

const StyledVideo = styled.video`
  height: 40%;
  width: 50%;
`;

export default connect(mapStateToProps, mapDispatchToProps)(MeetingRoom);
