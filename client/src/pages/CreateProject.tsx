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

interface MembersData {
  name: string;
  accessPermission: AccessPermission;
}

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

  const [createProjectData, setCreateProjectData] = useState<CreateProjectData>(
    {
      name: '',
      description: '',
    }
  );

  const [members, setMembers] = useState<string>('');

  const [addMembers, setAddMembers] = useState<MembersData[]>([]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setCreateProjectData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

  const history = useHistory();
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    createProject(createProjectData, history);
  };

  const handleMembersChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMembers(e.target.value);
  };

  const handleAddMembers = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    const emailValidated = validateEmail(members);

    if (members !== '' && emailValidated) {
      setAddMembers((prevData) => [
        ...prevData,
        { name: members, accessPermission: AccessPermission.ReadOnly },
      ]);
      removeAlert('members');
      setMembers('');
    } else {
      setAlert('Please include a valid email', MessageType.Fail, 'members');
    }
  };

  return (
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
              onChange={handleMembersChange}
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
          <Select disabled>
            <option value='0'>Admin</option>
          </Select>
          {addMembers.map((member, index) => (
            <Fragment key={index}>
              <MemberName>{member.name}</MemberName>
              <Select name='accessPermission'>
                <option value='0'>Admin</option>
                <option value='2'>Read/Write/Delete</option>
                <option value='1' selected>
                  Read Only
                </option>
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

const Form = styled.form`
  word-wrap: break-word;
  span {
    color: ${setColor.mainRed};
  }
  label {
    margin-bottom: 5px;
    margin-top: 10px;
    color: ${setColor.primary};
    font-weight: 600;
    font-size: ${setRem(15)};
  }
`;

const StyledButton = styled(Button)`
  margin-top: 30px;
  margin-right: 10px;
`;

const Select = styled.select`
  width: 15vw;
  padding: 5px;
  height: 30px;
  border-radius: 5px;
  border: solid ${setColor.primaryLight} 2px;
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
    border: solid ${setColor.primaryLight} 2px;
    outline: none;
    &:focus {
      border-color: ${setColor.primary};
    }
  }
  textarea {
    border-radius: 5px;
    padding: 10px;
    resize: none;
    border: solid ${setColor.primaryLight} 2px;
    outline: none;
    &:focus {
      border-color: ${setColor.primary};
    }
  }
`;

const MemberName = styled.div`
  color: ${setColor.primary};
  font-weight: 500;
  font-size: ${setRem(14)};
  margin-top: 10px;
  margin-bottom: 5px;
`;

export default connect(mapStateToProps, mapDispatchToProps)(CreateProject);
