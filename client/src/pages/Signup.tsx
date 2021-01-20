import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import BaseAuth from '../components/auth/BaseAuth';
import { Button } from '../components/global/Button';
import { setColor } from '../styles';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  input {
    width: 20vw;
    height: 40px;
    padding: 15px;
    margin-bottom: 20px;
    border: solid ${setColor.secondary} 2px;
    &:focus {
      outline: ${setColor.primary} 1px solid;
    }
  }
  label {
    font-weight: 500;
    margin-bottom: 5px;
  }
`;

const InputContainer = styled.div`
  display: flex;
`;

const Item = styled.div`
  display: flex;
  flex-direction: column;
  margin-right: 40px;
`;

interface SignupProps {}

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const Signup: React.FC<SignupProps> = () => {
  useEffect(() => {
    document.title = 'Sign Up | DevCollab';
  });

  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(formData);
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <BaseAuth
      title='Create an Account.'
      googleButtonText='Sign Up with Google'
      otherAuth='SIGNIN'
    >
      <form onSubmit={onSubmit}>
        <Container>
          <InputContainer>
            <Item>
              <label htmlFor='firstName'>First Name</label>
              <input
                type='text'
                id='firstName'
                name='firstName'
                placeholder='First Name'
                value={formData.firstName}
                onChange={onChange}
              />
            </Item>
            <Item>
              <label htmlFor='lastName'>Last Name</label>
              <input
                type='text'
                id='lastName'
                name='lastName'
                placeholder='Last Name'
                value={formData.lastName}
                onChange={onChange}
              />
            </Item>
          </InputContainer>

          <Item>
            <label htmlFor='email'>Email</label>
            <input
              type='email'
              id='email'
              name='email'
              placeholder='Email'
              value={formData.email}
              onChange={onChange}
            />
          </Item>

          <InputContainer>
            <Item>
              <label htmlFor='password'>Password</label>
              <input
                type='password'
                id='password'
                name='password'
                placeholder='Password (min. 8 characters)'
                value={formData.password}
                onChange={onChange}
              />
            </Item>

            <Item>
              <label htmlFor='confirmPassword'>Confirm Password</label>
              <input
                type='password'
                id='confirmPassword'
                name='confirmPassword'
                placeholder='Confirm password'
                value={formData.confirmPassword}
                onChange={onChange}
              />
            </Item>
          </InputContainer>
        </Container>

        <Button small>Create Account</Button>
      </form>
    </BaseAuth>
  );
};

export default Signup;
