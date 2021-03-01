import { Dispatch } from 'react';
import { ThunkDispatch } from 'redux-thunk';
import axios from 'axios';

import api from '../api';
import { removeAlert, setAlert } from './alertActions';
import { MessageType } from './alertTypes';
import {
  REGISTER_SUCCESS,
  SET_LOADING,
  REMOVE_LOADING,
  LOGIN_SUCCESS,
  USER_LOADED,
  USER_DELETED,
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
  UserDeleteDispatchTypes,
  LogoutDispatchTypes,
  NotFoundDispatch,
  UpdateUserDispatchTypes,
  SignInData,
  SignUpData,
  UserData,
} from './authTypes';
import { clearDiscussion } from './discussionActions';
import { clearProject } from './projectActions';
import { clearMeeting } from './meetingActions';
import { clearNote } from './noteActions';
import { clearFile } from './fileActions';

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

    //Clear all state
    dispatch(clearDiscussion());
    dispatch(clearProject());
    dispatch(clearMeeting());
    dispatch(clearNote());
    dispatch(clearFile());

    dispatch({ type: REMOVE_LOADING });
    dispatch({ type: LOGOUT_SUCCESS });
  } catch (err) {
    dispatch({ type: LOGOUT_FAIL });
    dispatch({ type: REMOVE_LOADING });
  }
};

//Update user
export const updateUser = (userData: UserData, image?: File) => async (
  dispatch: ThunkDispatch<{}, {}, UpdateUserDispatchTypes>
) => {
  try {
    dispatch(removeAlert());

    const {
      firstName,
      lastName,
      email,
      currentPassword,
      confirmNewPassowrd,
      newPassword,
    } = userData;

    //Create multipart/form-data
    const fd = new FormData();

    fd.append('firstName', firstName);
    fd.append('lastName', lastName);
    fd.append('email', email);
    fd.append('currentPassword', currentPassword);
    fd.append('confirmNewPassowrd', confirmNewPassowrd);
    fd.append('newPassword', newPassword);
    if (image) fd.append('avatar', image);

    const res = await axios.patch('/api/user', fd);

    dispatch({ type: USER_UPDATED, payload: res.data });
    dispatch(setAlert('User updated', MessageType.Success, 'input'));
  } catch (err) {
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach((error: any) => {
        dispatch(setAlert(error.msg, MessageType.Fail, error.param));
      });
    }
  }
};

//Delete user
export const deleteUser = () => async (
  dispatch: Dispatch<UserDeleteDispatchTypes>
) => {
  await api.delete('/user');
  dispatch({ type: USER_DELETED });
};

//Page not found
export const createNotFound = () => (dispatch: Dispatch<NotFoundDispatch>) => {
  dispatch({ type: NOT_FOUND });
};

//Clear page not found
export const clearNotFound = () => (dispatch: Dispatch<NotFoundDispatch>) => {
  dispatch({ type: NOT_FOUND_CLEAR });
};
