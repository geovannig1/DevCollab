import React, { useEffect, useState, Fragment } from 'react';
import styled from 'styled-components';
import { Link, useHistory } from 'react-router-dom';
import AddIcon from '@material-ui/icons/Add';
import { connect } from 'react-redux';
import HelpIcon from '@material-ui/icons/Help';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';
import { History } from 'history';

import { Store } from '../store';
import { setAlert, removeAlert } from '../actions/alertActions';
import { AuthInitialState } from '../reducers/authReducer';
import { setColor, setRem } from '../styles';
import Paper from '../components/global/Paper';
import { Button } from '../components/global/Button';
import { CreateProjectData, AccessPermission } from '../actions/projectTypes';
import { createProject } from '../actions/projectActions';
import ALert from '../components/global/Alert';
import validateEmail from '../utils/validateEmail';
import { MessageType } from '../actions/alertTypes';

interface CreateProjectProps {
  auth: AuthInitialState;
  createProject: (
    createProjectData: CreateProjectData,
    history: History
  ) => Promise<void>;
  setAlert: (
    message: string,
    messageType: MessageType,
    location: string
  ) => void;
  removeAlert: (location: string) => void;
}

const CreateProject: React.FC<CreateProjectProps> = ({
  auth: { user },
  createProject,
  setAlert,
  removeAlert,
}) => {
  useEffect(() => {
    document.title = 'Create new project | DevCollab';
  }, []);

  //Form state
  const [createProjectData, setCreateProjectData] = useState<CreateProjectData>(
    {
      name: '',
      description: '',
      members: [],
    }
  );

  //Members state
  const [members, setMembers] = useState<string>('');

  //Handle form input change
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setCreateProjectData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

  const history = useHistory();

  //Submit form data
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    createProject(createProjectData, history);
  };

  //Handle member that will be added to project
  const handleAddMembers = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    const emailValidated = validateEmail(members);

    //Check if email already added
    const emailExist = createProjectData.members.filter(
      (member) => member.email === members
    );

    if (emailExist.length !== 0) {
      setAlert('Email already on the list', MessageType.Fail, 'members');
    } else if (members !== '' && emailValidated) {
      setCreateProjectData((prevData) => ({
        ...prevData,
        members: [
          ...prevData.members,
          { email: members, accessPermission: AccessPermission.ReadOnly },
        ],
      }));

      removeAlert('members');
      setMembers('');
    } else {
      setAlert('Please include a valid email', MessageType.Fail, 'members');
    }
  };

  //Handle member permission
  const handleChangeEditPermission = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const value: AccessPermission = parseInt(e.target.value);

    let changePermission = createProjectData.members.find(
      (data) => data.email === e.target.name
    );

    if (changePermission) {
      changePermission.accessPermission = value;
    }

    //Find the index of member
    const index = createProjectData.members
      .map((member) => member.accessPermission)
      .indexOf(value);

    if (changePermission !== undefined) {
      const newData = changePermission;
      setCreateProjectData((prevData) => ({
        ...prevData,
        members: [
          ...prevData.members,
          ...prevData.members.splice(index, 0, newData),
        ],
      }));
    }
  };

  return (
    <Fragment>
      <Title>{createProjectData.name.trim() || 'Project Name'}</Title>
      <Paper>
        <Form onSubmit={handleSubmit}>
          <Item>
            <label htmlFor='name'>
              Project Name <span>*</span>
            </label>
            <input
              name='name'
              autoComplete='off'
              spellCheck='false'
              id='name'
              type='text'
              placeholder='Enter the name of the project'
              onChange={handleChange}
              value={createProjectData.name}
            />
          </Item>

          <Item>
            <label htmlFor='description'>Description</label>
            <textarea
              name='description'
              id='description'
              rows={8}
              placeholder='Describe the project'
              onChange={handleChange}
              value={createProjectData.description}
            />
          </Item>

          <Item>
            <label htmlFor='members'>Invite Members</label>
            <AddMemberContainer>
              <input
                type='email'
                id='members'
                name='members'
                placeholder='Enter member email'
                onChange={(e) => setMembers(e.target.value)}
                value={members}
              />
              <button onClick={handleAddMembers}>
                <AddIcon fontSize='small' />
              </button>
            </AddMemberContainer>
          </Item>

          <label htmlFor='members'>
            Project Access Permission
            <HelpIcon fontSize='small' />
          </label>

          <Item id='members'>
            <MemberName>{user?.email}</MemberName>
            <Select disabled style={{ cursor: 'not-allowed' }}>
              <option value={AccessPermission.Admin}>Admin</option>
            </Select>
            {createProjectData.members.map((member, index) => (
              <Fragment key={index}>
                <MemberName>{member.email}</MemberName>
                <Select
                  name={member.email}
                  defaultValue={AccessPermission.ReadOnly}
                  onChange={handleChangeEditPermission}
                >
                  <option value={AccessPermission.Admin}>Admin</option>
                  <option value={AccessPermission.ReadWriteDelete}>
                    Read/Write/Delete
                  </option>
                  <option value={AccessPermission.ReadOnly}>Read Only</option>
                </Select>
              </Fragment>
            ))}
          </Item>

          <ALert />

          <StyledButton extrasmall={'extrasmall' && 1}>
            Create Project
          </StyledButton>
          <StyledButton
            extrasmall={'extrasmall' && 1}
            outline={'outline' && 1}
            as={Link}
            to='/projects'
          >
            Cancel
          </StyledButton>
        </Form>
      </Paper>
    </Fragment>
  );
};

const mapStateToProps = (state: Store) => ({
  auth: state.auth,
});

const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, AnyAction>) => ({
  setAlert: (message: string, messageType: MessageType, location: string) =>
    dispatch(setAlert(message, messageType, location)),
  removeAlert: (location: string) => dispatch(removeAlert(location)),
  createProject: (createProjectData: CreateProjectData, history: History) =>
    dispatch(createProject(createProjectData, history)),
});

const Title = styled.h2`
  margin-top: 20px;
  margin-bottom: 10px;
  color: ${setColor.mainBlack};
  font-weight: 500;
`;

const Form = styled.form`
  word-wrap: break-word;
  span {
    color: ${setColor.mainRed};
  }
  label {
    margin-bottom: 5px;
    margin-top: 10px;
    color: ${setColor.mainBlack};
    font-weight: 600;
    font-size: ${setRem(15)};
  }
`;

const StyledButton = styled(Button)`
  margin-top: 15px;
  margin-bottom: 10px;
  margin-right: 10px;
`;

const Select = styled.select`
  width: 15vw;
  padding: 5px;
  height: 30px;
  border-radius: 5px;
  border: solid ${setColor.lightBlack} 2px;
  outline: none;
`;

const AddMemberContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  button {
    background-color: ${setColor.primary};
    color: ${setColor.mainWhite};
    border: none;
    height: 30px;
    width: 30px;
    margin-left: 5px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 100%;
    outline: none;
    cursor: pointer;
    transition: 0.2s ease-in-out;
    &:hover {
      background-color: ${setColor.primaryDark};
    }
    &:active {
      background-color: ${setColor.primary};
    }
  }
`;

const Item = styled.div`
  display: flex;
  flex-direction: column;
  width: 45vw;
  margin-bottom: 10px;
  margin-top: 5px;
  input {
    border-radius: 5px;
    height: 20px;
    padding: 15px;
    border: solid ${setColor.lightBlack} 1px;
    outline: none;
    &:focus {
      border-color: ${setColor.primary};
    }
  }
  textarea {
    border-radius: 5px;
    padding: 10px;
    resize: none;
    border: solid ${setColor.lightBlack} 1px;
    outline: none;
    &:focus {
      border-color: ${setColor.primary};
    }
  }
`;

const MemberName = styled.div`
  color: ${setColor.mainBlack};
  font-weight: 500;
  font-size: ${setRem(14)};
  margin-top: 10px;
  margin-bottom: 5px;
`;

export default connect(mapStateToProps, mapDispatchToProps)(CreateProject);
