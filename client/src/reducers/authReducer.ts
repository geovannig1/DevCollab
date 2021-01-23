import {
  REGISTER_FAIL,
  REGISTER_SUCCESS,
  LOGIN_FAIL,
  LOGIN_SUCCESS,
  USER_LOADED,
  USER_LOAD_FAIL,
  USER_LOAD_LOADING,
  LOGOUT_FAIL,
  LOGOUT_LOADING,
  LOGOUT_SUCCESS,
  LoginDispatchTypes,
  RegisterDispacthTypes,
  LogoutDispatchTypes,
  UserLoadDispatchTypes,
  UserType,
} from '../actions/authTypes';

export interface AuthInitialState {
  loading: boolean;
  isAuthenticated: boolean;
  user?: UserType;
}

const authInitialState: AuthInitialState = {
  isAuthenticated: false,
  loading: false,
};

const authReducers = (
  state = authInitialState,
  action:
    | RegisterDispacthTypes
    | LoginDispatchTypes
    | UserLoadDispatchTypes
    | LogoutDispatchTypes
): AuthInitialState => {
  switch (action.type) {
    case LOGOUT_LOADING:
    case USER_LOAD_LOADING:
      return {
        ...state,
        loading: true,
      };
    case REGISTER_SUCCESS:
    case LOGIN_SUCCESS:
    case LOGOUT_FAIL:
      return {
        ...state,
        loading: false,
        isAuthenticated: true,
      };
    case REGISTER_FAIL:
    case LOGIN_FAIL:
    case USER_LOAD_FAIL:
      return {
        ...state,
        isAuthenticated: false,
        loading: false,
      };
    case USER_LOADED:
      return {
        ...state,
        loading: false,
        isAuthenticated: true,
        user: action.payload,
      };
    case LOGOUT_SUCCESS:
      return {
        ...state,
        loading: false,
        isAuthenticated: false,
        user: undefined,
      };
    default:
      return state;
  }
};

export default authReducers;
