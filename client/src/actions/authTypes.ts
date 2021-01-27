export const SET_LOADING = 'SET_LOADING';
export const REMOVE_LOADING = 'REMOVE_LOADING';
export const REGISTER_SUCCESS = 'REGISTER_SUCCESS';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const USER_LOADED = 'USER_LOADED';
export const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS';
export const LOGOUT_FAIL = 'LOGOUT_FAIL';
export const AUTH_ERROR = 'AUTH_ERROR';

export interface RegisterSuccess {
  type: typeof REGISTER_SUCCESS;
}
export interface LoginSuccess {
  type: typeof LOGIN_SUCCESS;
}

export type UserType = {
  firstName: string;
  lastName: string;
  email: string;
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

export type RegisterDispatchTypes = RegisterSuccess | AuthError;
export type LoginDispatchTypes = LoginSuccess | AuthError;
export type LogoutDispatchTypes = LogoutSuccess | LogoutFail;
export type UserLoadDispatchTypes = UserLoaded | AuthError;
export type LoadingDispatch = Set_Loading | Remove_Loading;

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
