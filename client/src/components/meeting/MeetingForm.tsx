import React, { Fragment } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

import { Button } from '../../components/global/Button';
import { Form, InputContainer } from '../global/FormContainer';
import Alert from '../global/Alert';
import { MeetingTypes } from '../../actions/meetingTypes';
import SelectMembers from '../global/SelectMembers';
import { Member, ProjectType } from '../../actions/projectTypes';

interface MeetingFormProps {
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  roomData: MeetingTypes;
  setRoomData: React.Dispatch<React.SetStateAction<MeetingTypes>>;
  projectId: string;
  selectedProject?: ProjectType;
  update?: boolean;
  selectData?: Member[];
}

const MeetingForm: React.FC<MeetingFormProps> = ({
  handleSubmit,
  roomData,
  setRoomData,
  projectId,
  selectedProject,
  update,
  selectData,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRoomData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
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
              selectData={selectData}
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
