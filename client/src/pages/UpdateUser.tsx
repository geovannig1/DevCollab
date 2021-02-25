import React, { Fragment, useEffect, useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';

import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import { setColor, setRem } from '../styles';
import Paper from '../components/global/Paper';
import {
  Form,
  InputContainer,
  FileContainer,
} from '../components/global/FormContainer';
import { Button } from '../components/global/Button';
import { Store } from '../store';
import { AuthInitialState } from '../reducers/authReducer';
import { UserData } from '../actions/authTypes';
import avatar from '../assets/profile-picture.png';
import Alert from '../components/global/Alert';
import AlertSnackbar from '../components/global/AlertSnackbar';
import { updateUser, deleteUser } from '../actions/authActions';
import { AlertInitialState } from '../reducers/alertReducer';
import { MessageType } from '../actions/alertTypes';
import AlertDialog from '../components/global/AlertDialog';
import { clearProject } from '../actions/projectActions';

interface UpdateUserProps {
  auth: AuthInitialState;
  alert: AlertInitialState;
  updateUser: (userData: UserData, image?: File) => Promise<void>;
  deleteUser: () => Promise<void>;
  clearProject: () => void;
}

const UpdateUser: React.FC<UpdateUserProps> = ({
  auth: { user },
  alert,
  updateUser,
  deleteUser,
  clearProject,
}) => {
  useEffect(() => {
    document.title = 'User Settings | DevCollab';
    clearProject();
  }, [clearProject]);

  const [updatePassword, setUpdatePassword] = useState(false);
  useEffect(() => {
    if (alert.length > 0 && alert[0].messageType === MessageType.Success) {
      setUpdatePassword(false);
      setUserData((prevData) => ({
        ...prevData,
        currentPassword: '',
        newPassword: '',
        confirmNewPassowrd: '',
      }));
    }
  }, [alert]);

  const [image, setImage] = useState<File>();
  const [imagePreview, setImagePreview] = useState<
    string | ArrayBuffer | null
  >();
  const [userData, setUserData] = useState<UserData>({
    firstName: user?.firstName ?? '',
    lastName: user?.lastName ?? '',
    email: user?.email ?? '',
    currentPassword: '',
    newPassword: '',
    confirmNewPassowrd: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(file);
      setImagePreview(reader.result);
    };
    if (file) reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    updateUser(userData, image);
  };

  return (
    <Fragment>
      <Header>
        <Previous to='/projects'>
          <ArrowBackIosIcon />
          <span>Projects</span>
          <Title>User Settings</Title>
        </Previous>
      </Header>
      <Paper>
        <Form onSubmit={handleSubmit}>
          <ItemContainer>
            <InputContainer width='22'>
              <label htmlFor='firstName'>
                First Name <span>*</span>
              </label>
              <input
                type='text'
                id='firstName'
                name='firstName'
                placeholder='First name'
                onChange={handleChange}
                value={userData.firstName}
                style={{ marginRight: '10px' }}
              />
            </InputContainer>

            <InputContainer width='23'>
              <label htmlFor='lastName'>
                Last Name <span>*</span>
              </label>
              <input
                type='text'
                id='lastName'
                name='lastName'
                placeholder='Last name'
                onChange={handleChange}
                value={userData.lastName}
              />
            </InputContainer>
          </ItemContainer>

          <FileContainer>
            <label htmlFor='image'>Profile Picture</label>
            <Avatar
              src={
                imagePreview
                  ? imagePreview?.toString()
                  : user?.avatar?.url
                  ? user.avatar?.url
                  : avatar
              }
              alt='profile-avatar'
            />
            <input
              type='file'
              id='image'
              name='image'
              accept='image/*'
              onChange={handleImageChange}
            />
          </FileContainer>

          <InputContainer>
            <label htmlFor='email'>
              Email <span>*</span>
            </label>
            <input
              type='email'
              id='email'
              name='email'
              placeholder='Email'
              onChange={handleChange}
              value={userData.email}
            />
          </InputContainer>

          <CheckboxContainer>
            <input
              type='checkbox'
              name='changePassword'
              id='changePassword'
              checked={updatePassword}
              onChange={(e) => {
                setUpdatePassword(e.target.checked);
                setUserData((prevData) => ({
                  ...prevData,
                  currentPassword: '',
                  newPassword: '',
                  confirmNewPassowrd: '',
                }));
              }}
            />
            <span>Update password?</span>
          </CheckboxContainer>

          {user?.havePassword && (
            <InputContainer>
              <label htmlFor='currentPassword'>Current Password</label>
              <input
                type='password'
                id='currentPassword'
                name='currentPassword'
                placeholder='Current password'
                onChange={handleChange}
                value={userData.currentPassword}
                disabled={!updatePassword}
              />
            </InputContainer>
          )}

          <InputContainer>
            <label htmlFor='newPassword'>New Password</label>
            <input
              type='password'
              id='newPassword'
              name='newPassword'
              placeholder='New password'
              onChange={handleChange}
              value={userData.newPassword}
              style={{ marginBottom: '5px' }}
              disabled={!updatePassword}
            />
            <input
              type='password'
              id='confirmPassword'
              name='confirmNewPassowrd'
              placeholder='Cofirm password'
              onChange={handleChange}
              value={userData.confirmNewPassowrd}
              disabled={!updatePassword}
            />
          </InputContainer>

          {alert.length > 0 && alert[0].messageType === MessageType.Success && (
            <AlertSnackbar />
          )}
          {alert.length > 0 && alert[0].messageType === MessageType.Fail && (
            <Alert />
          )}

          <StyledButton extrasmall>Update</StyledButton>
          <StyledButton
            as={Link}
            to='/projects'
            extrasmall={'extrasmall' && 1}
            outline={'outline' && 1}
          >
            Cancel
          </StyledButton>
        </Form>
        <AlertDialog
          deleteButton
          title='Delete Account'
          deleteItem={deleteUser}
          text="Are you sure want to delete this account? this process can't be undone."
          firstButton='Delete Account'
          secondButton='Cancel'
        >
          <DeleteButton>Delete Account?</DeleteButton>
        </AlertDialog>
      </Paper>
    </Fragment>
  );
};

const mapStateToProps = (state: Store) => ({
  auth: state.auth,
  alert: state.alert,
});

const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, AnyAction>) => ({
  updateUser: (userData: UserData, image?: File) =>
    dispatch(updateUser(userData, image)),
  deleteUser: () => dispatch(deleteUser()),
  clearProject: () => dispatch(clearProject()),
});

const Header = styled.div`
  display: flex;
  margin-bottom: 20px;
`;

const Previous = styled(Link)`
  color: ${setColor.lightBlack};
  display: flex;
  align-items: center;
  text-decoration: none;
  transition: 0.2s ease-in-out;
  user-select: none;
  outline: none;
  span {
    font-weight: 600;
  }
  &:hover {
    color: ${setColor.mainBlack};
  }
  &:active {
    color: ${setColor.lightBlack};
  }
`;

const Title = styled.h2`
  margin: 0 15px;
  color: ${setColor.mainBlack};
  font-weight: 500;
`;

const StyledButton = styled(Button)`
  margin-top: 15px;
  margin-right: 10px;
`;

const Avatar = styled.img`
  height: 60px;
  width: 60px;
  margin: 5px 0;
  border-radius: 100%;
  object-fit: cover;
`;

const ItemContainer = styled.div`
  display: flex;
`;

const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  margin: 15px 0;
  input {
    cursor: pointer;
    transform: scale(1.3);
  }
  span {
    color: ${setColor.mainBlack};
    margin: 0 5px;
    font-weight: 500;
    font-size: ${setRem(14)};
  }
`;

const DeleteButton = styled.span`
  background-color: ${setColor.mainWhite};
  outline: none;
  border: none;
  cursor: pointer;
  color: ${setColor.mainRed};
  transition: 0.3s ease-in-out;
  &:hover {
    color: ${setColor.lightRed};
  }
  &:active {
    color: ${setColor.mainRed};
  }
`;

export default connect(mapStateToProps, mapDispatchToProps)(UpdateUser);
