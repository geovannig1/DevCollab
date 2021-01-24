export const SET_LOADING = 'SET_LOADING';
export const REMOVE_LOADING = 'REMOVE_LOADING';

export const REGISTER_SUCCESS = 'REGISTER_SUCCESS';
export const REGISTER_FAIL = 'REGISTER_FAIL';

export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAIL = 'LOGIN_FAIL';

export const USER_LOADED = 'USER_LOADED';
export const USER_LOAD_FAIL = 'USER_LOAD_FAIL';

export const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS';
export const LOGOUT_FAIL = 'LOGOUT_FAIL';

export interface RegisterSuccess {
  type: typeof REGISTER_SUCCESS;
}
export interface RegisterFail {
  type: typeof REGISTER_FAIL;
}

export interface LoginSuccess {
  type: typeof LOGIN_SUCCESS;
}
export interface LoginFail {
  type: typeof LOGIN_FAIL;
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
export interface UserLoadFail {
  type: typeof USER_LOAD_FAIL;
}

export interface LogoutSuccess {
  type: typeof LOGOUT_SUCCESS;
}
export interface LogoutFail {
  type: typeof LOGOUT_FAIL;
}

export type RegisterDispatchTypes = RegisterSuccess | RegisterFail;
export type LoginDispatchTypes = LoginSuccess | LoginFail;
export type LogoutDispatchTypes = LogoutSuccess | LogoutFail;
export type UserLoadDispatchTypes = UserLoaded | UserLoadFail;
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
