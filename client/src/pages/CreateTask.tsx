import React, { useEffect, useState } from 'react';
import { AnyAction } from 'redux';
import { connect } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { useParams, Link, Redirect, useHistory } from 'react-router-dom';
import styled from 'styled-components';
import Select, { OptionsType } from 'react-select';

import socket from '../utils/socketio';
import { Store } from '../store';
import { clearNavbar, setNavbar } from '../actions/navbarAction';
import { loadProject } from '../actions/projectActions';
import { SelectedType } from '../actions/navbarTypes';
import { ProjectInitialState } from '../reducers/projectReducer';
import Paper from '../components/global/Paper';
import Previous from '../components/global/Previous';
import {
  DateContaiener,
  Form,
  InputContainer,
} from '../components/global/FormContainer';
import { Button } from '../components/global/Button';
import { setColor, setRem } from '../styles';
import avatar from '../assets/profile-picture.png';
import { TaskData } from '../components/task/taskTypes';

interface SelectOption {
  value: string;
  label: JSX.Element;
}

interface CreateTaskProps {
  setNavbar: (selected: SelectedType) => void;
  loadProject: (projectId: string) => Promise<void>;
  clearNavbar: () => void;
  project: ProjectInitialState;
}

const CreateTask: React.FC<CreateTaskProps> = ({
  setNavbar,
  clearNavbar,
  loadProject,
  project: { selectedProject, projectError },
}) => {
  const { projectId, columnId } = useParams<{
    projectId: string;
    columnId: string;
  }>();
  const history = useHistory();

  useEffect(() => {
    document.title = 'Create Task | DevCollab';
    !selectedProject && loadProject(projectId);
    projectError && <Redirect to='/projects' />;

    setNavbar(SelectedType.Task);
    return () => clearNavbar();
  }, [
    setNavbar,
    clearNavbar,
    loadProject,
    projectError,
    projectId,
    selectedProject,
  ]);

  //Create option for the select options
  const [selectOptions, setSelectOptions] = useState<SelectOption[]>([]);
  useEffect(() => {
    selectedProject?.members.map((member) =>
      setSelectOptions((prevData) => [
        ...prevData,
        {
          label: (
            <LabelContainer style={{ display: 'flex', alignItems: 'center' }}>
              <img src={member.user.avatar ?? avatar} alt='user profile' />
              <label>{member.user.email}</label>
            </LabelContainer>
          ),
          value: member.user._id.toString(),
        },
      ])
    );
  }, [setSelectOptions, selectedProject]);

  //Set form data
  const [taskData, setTaskData] = useState<TaskData>({
    title: '',
    description: '',
    members: [],
    dueDate: '',
  });

  const handleChangeMembers = (options: OptionsType<SelectOption>) => {
    const members = options.map((option) => ({ value: option.value }));
    setTaskData((prevData) => ({ ...prevData, members }));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setTaskData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    socket.emit('create task', {
      projectId: selectedProject?._id,
      columnId,
      taskData,
    });

    history.push({
      pathname: `/projects/${selectedProject?._id}/tasks`,
      state: { fromCreateTask: true, createTaskProgress: true },
    });
  };

  return (
    <Paper>
      <Previous
        link={`/projects/${selectedProject?._id}/tasks`}
        previousTo='Tasks'
        title={taskData.title.trim() || 'Add Task'}
      />
      <Form onSubmit={handleSubmit}>
        <InputContainer>
          <label htmlFor='title'>
            Task Title <span>*</span>
          </label>
          <input
            required
            type='text'
            id='title'
            name='title'
            placeholder='Task title'
            onChange={handleChange}
            value={taskData.title}
          />
        </InputContainer>
        <InputContainer>
          <label htmlFor='description'>Description</label>
          <textarea
            rows={8}
            placeholder='Describe the task'
            id='description'
            name='description'
            onChange={handleChange}
            value={taskData.description}
          />
        </InputContainer>
        <InputContainer>
          <label htmlFor='members'>Members</label>
          <Select
            options={selectOptions}
            isMulti
            styles={customStyle}
            onChange={handleChangeMembers}
          />
        </InputContainer>
        <DateContaiener>
          <label htmlFor='dueDate'>Due Date</label>
          <input
            type='date'
            name='dueDate'
            id='dueDate'
            onChange={handleChange}
            value={taskData.dueDate}
          />
        </DateContaiener>
        <StyledButton extrasmall>Add Task</StyledButton>
        <StyledButton
          as={Link}
          to={`/projects/${selectedProject?._id}/tasks`}
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
  clearNavbar: () => dispatch(clearNavbar()),
  setNavbar: (selected: SelectedType) => dispatch(setNavbar(selected)),
  loadProject: (projectId: string) => dispatch(loadProject(projectId)),
});

const customStyle = {
  control: (base: any) => ({
    ...base,
    border: `1px solid ${setColor.lightBlack}`,
    boxShadow: 'none',
    '&:hover': { borderColor: setColor.primary },
  }),
};

const StyledButton = styled(Button)`
  margin-top: 10px;
  margin-right: 10px;
`;

const LabelContainer = styled.div`
  img {
    height: 30px;
    width: 30px;
    object-fit: cover;
    margin-right: 5px;
    border-radius: 100%;
  }
  label {
    font-weight: 500;
    font-size: ${setRem(12)};
  }
`;

export default connect(mapStateToProps, mapDispatchToProps)(CreateTask);
