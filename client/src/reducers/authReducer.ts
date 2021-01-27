import {
  REGISTER_SUCCESS,
  LOGIN_SUCCESS,
  USER_LOADED,
  SET_LOADING,
  REMOVE_LOADING,
  LOGOUT_SUCCESS,
  LOGOUT_FAIL,
  AUTH_ERROR,
  LoadingDispatch,
  LoginDispatchTypes,
  RegisterDispatchTypes,
  LogoutDispatchTypes,
  UserLoadDispatchTypes,
  UserType,
} from '../actions/authTypes';

export interface AuthInitialState {
  loading: boolean;
  isAuthenticated: boolean;
  user?: UserType;
  authError?: object;
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
    | LogoutDispatchTypes
    | LoadingDispatch
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
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload,
      };
    case LOGOUT_SUCCESS:
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
    default:
      return state;
  }
};

export default authReducer;
