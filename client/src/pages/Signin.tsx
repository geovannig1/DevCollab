import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { ThunkDispatch } from 'redux-thunk';
import { connect } from 'react-redux';
import { AnyAction } from 'redux';
import { Redirect } from 'react-router-dom';

import { setColor } from '../styles';
import { Button } from '../components/global/Button';
import BaseAuth from '../components/auth/BaseAuth';
import { Store } from '../store';
import { signIn } from '../actions/authActions';
import { SignInData } from '../actions/authTypes';
import { AuthInitialState } from '../reducers/authReducer';
import Alert from '../components/global/Alert';
import AlertSnackbar from '../components/global/AlertSnackbar';

interface SigninProps {
  signIn: (signInData: SignInData) => void;
  auth: AuthInitialState;
}

const Signin: React.FC<SigninProps> = ({
  signIn,
  auth: { isAuthenticated, loading },
}) => {
  useEffect(() => {
    document.title = 'Sign In | DevCollab';
  }, []);

  const [signInData, setSignInData] = useState<SignInData>({
    email: '',
    password: '',
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    signIn(signInData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSignInData((prevSignInData) => ({
      ...prevSignInData,
      [e.target.name]: e.target.value,
    }));
  };

  if (!loading && isAuthenticated) {
    return <Redirect to='/projects' />;
  }

  return (
    <BaseAuth
      title='Sign In.'
      googleButtonText='Sign In with Google'
      otherAuth='SIGNUP'
    >
      <Form onSubmit={handleSubmit}>
        <Container>
          <label htmlFor='email'>Email</label>
          <input
            type='email'
            id='email'
            name='email'
            placeholder='Email'
            value={signInData.email}
            onChange={handleChange}
          />

          <label htmlFor='password'>Password</label>
          <input
            type='password'
            id='password'
            name='password'
            placeholder='Password (min. 8 characters)'
            value={signInData.password}
            onChange={handleChange}
          />
        </Container>

        <Button small>Sign In</Button>
      </Form>

      <Alert />
    </BaseAuth>
  );
};

const mapStateToProps = (state: Store) => ({
  auth: state.auth,
});

const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, AnyAction>) => ({
  signIn: (signInData: SignInData) => dispatch(signIn(signInData)),
});

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

const Form = styled.form`
  margin-bottom: 10px;
`;

export default connect(mapStateToProps, mapDispatchToProps)(Signin);
