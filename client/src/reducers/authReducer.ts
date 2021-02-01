import {
  REGISTER_SUCCESS,
  LOGIN_SUCCESS,
  USER_LOADED,
  USER_UPDATED,
  SET_LOADING,
  REMOVE_LOADING,
  LOGOUT_SUCCESS,
  LOGOUT_FAIL,
  AUTH_ERROR,
  NOT_FOUND,
  NOT_FOUND_CLEAR,
  USER_DELETED,
  LoadingDispatch,
  LoginDispatchTypes,
  RegisterDispatchTypes,
  LogoutDispatchTypes,
  UserLoadDispatchTypes,
  UpdateUserDispatchTypes,
  NotFoundDispatch,
  UserDeleteDispatchTypes,
  UserType,
} from '../actions/authTypes';

export interface AuthInitialState {
  loading: boolean;
  isAuthenticated: boolean;
  user?: UserType;
  authError?: object;
  notFound?: boolean;
}

const authInitialState: AuthInitialState = {
  isAuthenticated: false,
  loading: true,
};

const authReducer = (
  state = authInitialState,
  action:
    | RegisterDispatchTypes
    | LoginDispatchTypes
    | UserLoadDispatchTypes
    | UpdateUserDispatchTypes
    | LogoutDispatchTypes
    | LoadingDispatch
    | NotFoundDispatch
    | UserDeleteDispatchTypes
): AuthInitialState => {
  switch (action.type) {
    case SET_LOADING:
      return {
        ...state,
        loading: true,
      };
    case REMOVE_LOADING:
      return {
        ...state,
        loading: false,
      };
    case REGISTER_SUCCESS:
    case LOGIN_SUCCESS:
    case LOGOUT_FAIL:
      return {
        ...state,
        isAuthenticated: true,
      };
    case USER_LOADED:
    case USER_UPDATED:
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload,
      };
    case LOGOUT_SUCCESS:
    case USER_DELETED:
      return {
        ...state,
        isAuthenticated: false,
        user: undefined,
      };
    case AUTH_ERROR:
      return {
        ...state,
        isAuthenticated: false,
        authError: action.payload,
      };
    case NOT_FOUND:
      return {
        ...state,
        notFound: true,
      };
    case NOT_FOUND_CLEAR:
      return {
        ...state,
        notFound: undefined,
      };
    default:
      return state;
  }
};

export default authReducer;
