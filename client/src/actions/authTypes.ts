export const REGISTER_SUCCESS = 'REGISTER_SUCCESS';
export const REGISTER_FAIL = 'REGISTER_FAIL';

export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAIL = 'LOGIN_FAIL';

export const USER_LOADED = 'USER_LOADED';
export const USER_LOAD_FAIL = 'USER_LOAD_FAIL';
export const USER_LOAD_LOADING = 'USER_LOAD_LOADING';

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

export interface UserLoadLoading {
  type: typeof USER_LOAD_LOADING;
}
export interface UserLoaded {
  type: typeof USER_LOADED;
  payload: UserType;
}
export interface UserLoadFail {
  type: typeof USER_LOAD_FAIL;
}

export type RegisterDispacthTypes = RegisterSuccess | RegisterFail;

export type LoginDispatchTypes = LoginSuccess | LoginFail;

export type UserLoadDispatchTypes = UserLoaded | UserLoadFail | UserLoadLoading;

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
