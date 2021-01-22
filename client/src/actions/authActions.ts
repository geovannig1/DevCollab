import { ThunkDispatch } from 'redux-thunk';

import api from '../api/api';
import { setAlert } from './alertActions';
import { MessageType } from './alertTypes';
import {
  REGISTER_FAIL,
  REGISTER_SUCCESS,
  LOGIN_FAIL,
  LOGIN_SUCCESS,
  USER_LOADED,
  USER_LOAD_FAIL,
  USER_LOAD_LOADING,
  RegisterDispacthTypes,
  LoginDispatchTypes,
  UserLoadDispatchTypes,
  SignInData,
  SignUpData,
} from './authTypes';

//Load User
export const loadUser = () => async (
  dispatch: ThunkDispatch<{}, {}, UserLoadDispatchTypes>
) => {
  try {
    dispatch({ type: USER_LOAD_LOADING });

    const res = await api.get('/user');
    dispatch({ type: USER_LOADED, payload: res.data });
  } catch (err) {
    dispatch({ type: USER_LOAD_FAIL });
  }
};

//Register User
export const signUp = (signUpData: SignUpData) => async (
  dispatch: ThunkDispatch<{}, {}, RegisterDispacthTypes>
) => {
  try {
    await api.post('/auth/signup', signUpData);
    dispatch({ type: REGISTER_SUCCESS });
    dispatch(loadUser());
  } catch (err) {
    dispatch({ type: REGISTER_FAIL });
  }
};

//Sign In User
export const signIn = (signInData: SignInData) => async (
  dispatch: ThunkDispatch<{}, {}, LoginDispatchTypes>
) => {
  try {
    await api.post('/auth/signin', signInData);
    dispatch({ type: LOGIN_SUCCESS });
    dispatch(loadUser());
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach((error: any) => {
        dispatch(setAlert(error.msg, MessageType.fail, error.param));
      });
    }
    dispatch({ type: LOGIN_FAIL });
  }
};
