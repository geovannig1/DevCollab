import { Dispatch } from 'react';
import { ThunkDispatch } from 'redux-thunk';

import api from '../api';
import { removeAlert, setAlert } from './alertActions';
import { MessageType } from './alertTypes';
import {
  REGISTER_SUCCESS,
  SET_LOADING,
  REMOVE_LOADING,
  LOGIN_SUCCESS,
  USER_LOADED,
  AUTH_ERROR,
  NOT_FOUND,
  NOT_FOUND_CLEAR,
  LOGOUT_SUCCESS,
  LOGOUT_FAIL,
  USER_UPDATED,
  LoadingDispatch,
  RegisterDispatchTypes,
  LoginDispatchTypes,
  UserLoadDispatchTypes,
  LogoutDispatchTypes,
  NotFoundDispatch,
  UpdateUserDispatchTypes,
  SignInData,
  SignUpData,
  UserData,
} from './authTypes';

//Load User
export const loadUser = () => async (
  dispatch: ThunkDispatch<{}, {}, UserLoadDispatchTypes | LoadingDispatch>
) => {
  try {
    dispatch({ type: SET_LOADING });

    const res = await api.get('/user');

    dispatch({ type: USER_LOADED, payload: res.data });
    dispatch({ type: REMOVE_LOADING });
  } catch (err) {
    dispatch({
      type: AUTH_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });

    dispatch({ type: REMOVE_LOADING });
  }
};

//Register User
export const signUp = (signUpData: SignUpData) => async (
  dispatch: ThunkDispatch<{}, {}, RegisterDispatchTypes>
) => {
  try {
    dispatch(removeAlert());

    await api.post('/auth/signup', signUpData);

    dispatch({ type: REGISTER_SUCCESS });
    dispatch(loadUser());
  } catch (err) {
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach((error: any) =>
        dispatch(setAlert(error.msg, MessageType.Fail, error.param))
      );
    }

    dispatch({
      type: AUTH_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

//Sign In User
export const signIn = (signInData: SignInData) => async (
  dispatch: ThunkDispatch<{}, {}, LoginDispatchTypes>
) => {
  try {
    dispatch(removeAlert());

    await api.post('/auth/signin', signInData);
    dispatch({ type: LOGIN_SUCCESS });
    dispatch(loadUser());
  } catch (err) {
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach((error: any) => {
        dispatch(setAlert(error.msg, MessageType.Fail, error.param));
      });
    }
    dispatch({
      type: AUTH_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

//Sign out user
export const signOut = () => async (
  dispatch: ThunkDispatch<{}, {}, LogoutDispatchTypes | LoadingDispatch>
) => {
  try {
    dispatch({ type: SET_LOADING });

    await api.get('/auth/signout');

    dispatch({ type: REMOVE_LOADING });
    dispatch({ type: LOGOUT_SUCCESS });
  } catch (err) {
    dispatch({ type: LOGOUT_FAIL });
    dispatch({ type: REMOVE_LOADING });
  }
};

//Update user
export const updateUser = (userData: UserData, image: File) => async (
  dispatch: ThunkDispatch<{}, {}, UpdateUserDispatchTypes>
) => {
  try {
    userData.image = image;

    const res = await api.patch('/user', userData);
    dispatch({ type: USER_UPDATED, payload: res.data });
  } catch (err) {
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach((error: any) => {
        dispatch(setAlert(error.msg, MessageType.Fail, error.param));
      });
    }
    dispatch({
      type: AUTH_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

//Page not found
export const createNotFound = () => (dispatch: Dispatch<NotFoundDispatch>) => {
  dispatch({ type: NOT_FOUND });
};

//Clear page not found
export const clearNotFound = () => (dispatch: Dispatch<NotFoundDispatch>) => {
  dispatch({ type: NOT_FOUND_CLEAR });
};
