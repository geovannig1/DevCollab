import React, { useEffect, useRef, MutableRefObject } from 'react';
import { connect } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';
import { useParams } from 'react-router-dom';
import peer from 'simple-peer';
import { Socket } from 'socket.io-client';

import { Store } from '../store';
import { loadMeeting } from '../actions/meetingActions';
import { MeetingInitialState } from '../reducers/meetingReducer';
import socket from '../utils/socketio';
import { Stream } from 'nodemailer/lib/xoauth2';

interface MeetingRoomProps {
  meeting: MeetingInitialState;
  loadMeeting: (projectId: string, meetingId: string) => Promise<void>;
}

const MeetingRoom: React.FC<MeetingRoomProps> = ({ meeting, loadMeeting }) => {
  const { projectId, meetingId } = useParams<{
    projectId: string;
    meetingId: string;
  }>();

  useEffect(() => {
    document.title = 'Meeting Room | DevCollab';
    loadMeeting(projectId, meetingId);

    return () => {
      socket.emit('leave room', { meetingId });
    };
  }, [loadMeeting, projectId, meetingId]);

  const videoConstraints = {
    height: window.innerHeight / 2,
    width: window.innerWidth / 2,
  };

  const socketRef = useRef<Socket>();
  const userVideo = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({
        video: videoConstraints,
        audio: true,
      })
      .then((stream) => {
        if (userVideo.current) userVideo.current.srcObject = stream;

        //Join the meeting room
        socket.emit('join room', { meetingId });
      });
  }, []);

  return (
    <div>
      <video muted ref={userVideo} autoPlay playsInline />
    </div>
  );
};

const mapStateToProps = (state: Store) => ({
  meeting: state.meeting,
});

const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, AnyAction>) => ({
  loadMeeting: (projectId: string, meetingId: string) =>
    dispatch(loadMeeting(projectId, meetingId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(MeetingRoom);
