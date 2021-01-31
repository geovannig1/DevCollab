export const SET_LOADING = 'SET_LOADING';
export const REMOVE_LOADING = 'REMOVE_LOADING';
export const REGISTER_SUCCESS = 'REGISTER_SUCCESS';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const USER_LOADED = 'USER_LOADED';
export const USER_UPDATED = 'USER_UPDATED';
export const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS';
export const LOGOUT_FAIL = 'LOGOUT_FAIL';
export const AUTH_ERROR = 'AUTH_ERROR';
export const NOT_FOUND = 'NOT_FOUND';
export const NOT_FOUND_CLEAR = 'NOT_FOUND_CLEAR';

export interface RegisterSuccess {
  type: typeof REGISTER_SUCCESS;
}
export interface LoginSuccess {
  type: typeof LOGIN_SUCCESS;
}

export type UserType = {
  _id: number;
  firstName: string;
  lastName: string;
  email: string;
  avatar: string;
};

export interface Set_Loading {
  type: typeof SET_LOADING;
}
export interface Remove_Loading {
  type: typeof REMOVE_LOADING;
}

export interface UserLoaded {
  type: typeof USER_LOADED;
  payload: UserType;
}
export interface UserUpdated {
  type: typeof USER_UPDATED;
  payload: UserData;
}

export interface LogoutSuccess {
  type: typeof LOGOUT_SUCCESS;
}
export interface LogoutFail {
  type: typeof LOGOUT_FAIL;
}

export interface AuthError {
  type: typeof AUTH_ERROR;
  payload: { msg: string; status: string };
}

export interface NotFound {
  type: typeof NOT_FOUND;
}
export interface ClearNotFound {
  type: typeof NOT_FOUND_CLEAR;
}

export type RegisterDispatchTypes = RegisterSuccess | AuthError;
export type LoginDispatchTypes = LoginSuccess | AuthError;
export type LogoutDispatchTypes = LogoutSuccess | LogoutFail;
export type UserLoadDispatchTypes = UserLoaded | AuthError;
export type LoadingDispatch = Set_Loading | Remove_Loading;
export type NotFoundDispatch = NotFound | ClearNotFound;
export type UpdateUserDispatchTypes = UserUpdated | AuthError;

export interface SignUpData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}
export interface SignInData {
  email: string;
  password: string;
}
export interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  image?: File;
  currentPassword: string;
  newPassword: string;
  confirmNewPassowrd: string;
}
