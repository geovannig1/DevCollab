import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { useParams, Redirect, Link } from 'react-router-dom';
import styled from 'styled-components';

import { setColor, setRem } from '../styles';
import { Store } from '../store';
import { loadProject } from '../actions/projectActions';
import { ProjectInitialState } from '../reducers/projectReducer';
import { setNavbar, clearNavbar } from '../actions/navbarAction';
import { SelectedType } from '../actions/navbarTypes';
import Paper from '../components/global/Paper';
import Previous from '../components/global/Previous';
import { InputContainer, Form } from '../components/global/FormContainer';
import SelectMembers from '../components/global/SelectMembers';
import { Button } from '../components/global/Button';
import { MeetingTypes } from '../actions/meetingTypes';

interface CreateRoomProps {
  loadProject: (projectId: string) => Promise<void>;
  setNavbar: (selected: SelectedType) => void;
  clearNavbar: () => void;
  project: ProjectInitialState;
}

const CreateRoom: React.FC<CreateRoomProps> = ({
  loadProject,
  setNavbar,
  clearNavbar,
  project: { selectedProject, projectError },
}) => {
  const { projectId } = useParams<{ projectId: string }>();

  useEffect(() => {
    document.title = 'Create Room | DevCollab';
    setNavbar(SelectedType.Meeting);

    !selectedProject && loadProject(projectId);
    projectError && <Redirect to='/projects' />;

    return () => clearNavbar();
  }, [
    loadProject,
    projectId,
    selectedProject,
    projectError,
    setNavbar,
    clearNavbar,
  ]);

  const [roomData, setRoomData] = useState<MeetingTypes>({
    name: '',
    members: [],
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRoomData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(roomData);
  };

  return (
    <Paper>
      <Previous
        link={`/projects/${projectId}/meeting-rooms`}
        previousTo='Meeting Rooms'
        title='Create Room'
      />
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
          <label>Members</label>
          <SelectContainer>
            <SelectMembers
              selectedProject={selectedProject}
              setData={setRoomData}
            />
          </SelectContainer>
        </InputContainer>

        <StyledButton extrasmall>Create Room</StyledButton>
        <StyledButton
          as={Link}
          to={`/projects/${projectId}/meeting-rooms`}
          extrasmall={'extrasmall' && 1}
          outline={'outline' && 1}
        >
          Cancel
        </StyledButton>
      </Form>
    </Paper>
  );
};

const mapStateToProps = (state: Store) => ({
  project: state.project,
});

const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, AnyAction>) => ({
  loadProject: (projectId: string) => dispatch(loadProject(projectId)),
  setNavbar: (selected: SelectedType) => dispatch(setNavbar(selected)),
  clearNavbar: () => dispatch(clearNavbar()),
});

const StyledButton = styled(Button)`
  margin-top: 5px;
  margin-right: 10px;
`;

const SelectContainer = styled.div`
  width: 45vw;
`;

export default connect(mapStateToProps, mapDispatchToProps)(CreateRoom);
