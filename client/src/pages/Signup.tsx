import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';
import { Redirect } from 'react-router-dom';

import BaseAuth from '../components/auth/BaseAuth';
import { Button } from '../components/global/Button';
import { setColor } from '../styles';
import { signUp } from '../actions/authActions';
import { SignUpData } from '../actions/authTypes';
import { Store } from '../store';
import { AuthInitialState } from '../reducers/authReducer';
import Alert from '../components/global/Alert';

interface SignupProps {
  signUp: (signUpData: SignUpData) => void;
  auth: AuthInitialState;
}

const Signup: React.FC<SignupProps> = ({
  signUp,
  auth: { isAuthenticated, loading },
}) => {
  useEffect(() => {
    document.title = 'Sign Up | DevCollab';
  }, []);

  const [signUpData, setSignUpData] = useState<SignUpData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    signUp(signUpData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSignUpData((prevSignUpData) => ({
      ...prevSignUpData,
      [e.target.name]: e.target.value,
    }));
  };

  if (!loading && isAuthenticated) {
    return <Redirect to='/project' />;
  }

  return (
    <BaseAuth
      title='Create an Account.'
      googleButtonText='Sign Up with Google'
      otherAuth='SIGNIN'
    >
      <Form onSubmit={handleSubmit}>
        <Container>
          <InputContainer>
            <Item>
              <label htmlFor='firstName'>First Name</label>
              <input
                type='text'
                id='firstName'
                name='firstName'
                placeholder='First Name'
                value={signUpData.firstName}
                onChange={handleChange}
              />
            </Item>
            <Item>
              <label htmlFor='lastName'>Last Name</label>
              <input
                type='text'
                id='lastName'
                name='lastName'
                placeholder='Last Name'
                value={signUpData.lastName}
                onChange={handleChange}
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
              value={signUpData.email}
              onChange={handleChange}
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
                value={signUpData.password}
                onChange={handleChange}
              />
            </Item>

            <Item>
              <label htmlFor='confirmPassword'>Confirm Password</label>
              <input
                type='password'
                id='confirmPassword'
                name='confirmPassword'
                placeholder='Confirm password'
                value={signUpData.confirmPassword}
                onChange={handleChange}
              />
            </Item>
          </InputContainer>
        </Container>

        <Button small>Create Account</Button>
      </Form>

      <Alert />
    </BaseAuth>
  );
};

const mapStateToProps = (state: Store) => ({
  auth: state.auth,
});

const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, AnyAction>) => ({
  signUp: (signUpData: SignUpData) => dispatch(signUp(signUpData)),
});

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

const Form = styled.form`
  margin-bottom: 10px;
`;

export default connect(mapStateToProps, mapDispatchToProps)(Signup);
