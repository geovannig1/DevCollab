import React, { Fragment, useEffect, useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

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

interface UpdateUserProps {
  auth: AuthInitialState;
}

const UpdateUser: React.FC<UpdateUserProps> = ({ auth: { user } }) => {
  useEffect(() => {
    document.title = 'User Settings | DevCollab';
  }, []);

  const [updatePassword, setUpdatePassword] = useState(false);
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
    console.log(userData, image);
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
              src={imagePreview ? imagePreview?.toString() : avatar}
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
              placeholder='Cofirm password'
              onChange={handleChange}
              value={userData.confirmNewPassowrd}
              disabled={!updatePassword}
            />
          </InputContainer>

          <Alert />

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
        <span>Delete Account?</span>
      </Paper>
    </Fragment>
  );
};

const mapStateToProps = (state: Store) => ({
  auth: state.auth,
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
  margin-bottom: 10px;
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

export default connect(mapStateToProps)(UpdateUser);
