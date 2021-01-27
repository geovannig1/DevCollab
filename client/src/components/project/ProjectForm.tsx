import React, { Fragment, useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

import { setColor, setRem } from '../../styles';
import { setAlert, removeAlert } from '../../actions/alertActions';
import validateEmail from '../../utils/validateEmail';
import HelpIcon from '@material-ui/icons/Help';
import AddIcon from '@material-ui/icons/Add';
import { Button } from '../global/Button';
import ALert from '../global/Alert';
import { AccessPermission, ProjectData } from '../../actions/projectTypes';
import { UserType } from '../../actions/authTypes';
import { MessageType } from '../../actions/alertTypes';

interface ProjectFormProps {
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  user: UserType;
}

const ProjectForm: React.FC<ProjectFormProps> = ({
  handleSubmit,
  handleChange,
  user,
}) => {
  //Members state
  const [members, setMembers] = useState<string>('');

  //Form state
  const [projectData, setProjectData] = useState<ProjectData>({
    name: '',
    description: '',
    members: [],
  });

  //Handle member that will be added to project
  const handleAddMembers = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    const emailValidated = validateEmail(members);

    //Check if email already added
    const emailExist = projectData.members.filter(
      (member) => member.email === members
    );

    if (emailExist.length !== 0 || members === user?.email) {
      setAlert('Email already on the list', MessageType.Fail, 'members');
    } else if (members !== '' && emailValidated) {
      setProjectData((prevData) => ({
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

    let changePermission = projectData.members.find(
      (data) => data.email === e.target.name
    );

    if (changePermission) {
      changePermission.accessPermission = value;
    }

    //Find the index of member
    const index = projectData.members
      .map((member) => member.accessPermission)
      .indexOf(value);

    if (changePermission !== undefined) {
      const newData = changePermission;
      setProjectData((prevData) => ({
        ...prevData,
        members: [
          ...prevData.members,
          ...prevData.members.splice(index, 0, newData),
        ],
      }));
    }
  };

  return (
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
          value={projectData.name}
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
          value={projectData.description}
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
        {projectData.members.map((member, index) => (
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

      <StyledButton extrasmall={'extrasmall' && 1}>Create Project</StyledButton>
      <StyledButton
        extrasmall={'extrasmall' && 1}
        outline={'outline' && 1}
        as={Link}
        to='/projects'
      >
        Cancel
      </StyledButton>
    </Form>
  );
};

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

export default ProjectForm;
