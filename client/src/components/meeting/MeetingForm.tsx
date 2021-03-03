import React, { Fragment, useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

import { Button } from '../../components/global/Button';
import { Form, InputContainer } from '../global/FormContainer';
import Alert from '../global/Alert';
import { MeetingTypes } from '../../actions/meetingTypes';
import SelectMembers from '../global/SelectMembers';
import { ProjectType } from '../../actions/projectTypes';
import socket from '../../utils/socketio';
import { UserType } from '../../actions/authTypes';

interface MeetingFormProps {
  projectId: string;
  selectedProject?: ProjectType;
  update?: boolean;
  selectedMeeting?: MeetingTypes;
  user?: UserType;
  handleMeetingSubmit: (roomData: MeetingTypes) => void;
  setName: React.Dispatch<React.SetStateAction<string>>;
}

const MeetingForm: React.FC<MeetingFormProps> = ({
  projectId,
  selectedProject,
  update,
  selectedMeeting,
  user,
  handleMeetingSubmit,
  setName,
}) => {
  //Get the meeting members with avatar, access permission and email
  const roomMemberIds = selectedMeeting?.members.map(
    (member) => member.user._id
  );
  const roomMembers = selectedProject?.members.filter((member) =>
    roomMemberIds?.includes(member.user._id.toString())
  );

  const [roomData, setRoomData] = useState<MeetingTypes>({
    name: selectedMeeting?.name ?? '',
    members: selectedMeeting?.members ?? [],
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRoomData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
    if (e.target.name === 'name') setName(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleMeetingSubmit(roomData);

    //Handle send activity
    if (roomData.name && roomData.members) {
      socket.emit(`${update ? 'update' : 'create'} activity meeting`, {
        projectId,
        userName: `${user?.firstName} ${user?.lastName}`,
        roomName: roomData.name,
      });
    }
  };

  return (
    <Fragment>
      <Form onSubmit={handleSubmit}>
        <InputContainer>
          <label htmlFor='name'>
            Room Name <span>*</span>
          </label>
          <input
            type='text'
            id='name'
            name='name'
            placeholder='Room Name'
            onChange={handleChange}
            value={roomData.name}
          />
        </InputContainer>

        <InputContainer>
          <label>
            Members <span>*</span>
          </label>
          <SelectContainer>
            <SelectMembers
              selectedProject={selectedProject}
              setData={setRoomData}
              selectData={roomMembers}
            />
          </SelectContainer>
        </InputContainer>

        <StyledButton extrasmall>
          {update ? 'Update Room' : 'Create Room'}
        </StyledButton>
        <StyledButton
          as={Link}
          to={`/projects/${projectId}/meeting-rooms`}
          extrasmall={'extrasmall' && 1}
          outline={'outline' && 1}
        >
          Cancel
        </StyledButton>
      </Form>

      <Alert />
    </Fragment>
  );
};

const StyledButton = styled(Button)`
  margin-top: 5px;
  margin-right: 10px;
`;

const SelectContainer = styled.div`
  width: 45vw;
`;

export default MeetingForm;
