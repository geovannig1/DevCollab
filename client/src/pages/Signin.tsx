import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import { setColor } from '../styles';
import { Button } from '../components/global/Button';
import BaseAuth from '../components/auth/BaseAuth';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  input {
    width: 30vw;
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

interface FormData {
  email: string;
  password: string;
}

interface SigninProps {}

const Signin: React.FC<SigninProps> = () => {
  useEffect(() => {
    document.title = 'Sign Up | DevCollab';
  });

  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
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
      title='Sign In.'
      googleButtonText='Sign In with Google'
      otherAuth='SIGNUP'
    >
      <form onSubmit={onSubmit}>
        <Container>
          <label htmlFor='email'>Email</label>
          <input
            type='email'
            id='email'
            name='email'
            placeholder='Email'
            value={formData.email}
            onChange={onChange}
          />

          <label htmlFor='password'>Password</label>
          <input
            type='password'
            id='password'
            name='password'
            placeholder='Password (min. 8 characters)'
            value={formData.password}
            onChange={onChange}
          />
        </Container>

        <Button small>Create Account</Button>
      </form>
    </BaseAuth>
  );
};

export default Signin;
