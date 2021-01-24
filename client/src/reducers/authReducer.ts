import {
  REGISTER_FAIL,
  REGISTER_SUCCESS,
  LOGIN_FAIL,
  LOGIN_SUCCESS,
  USER_LOADED,
  USER_LOAD_FAIL,
  SET_LOADING,
  REMOVE_LOADING,
  LOGOUT_FAIL,
  LOGOUT_SUCCESS,
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
}

const authInitialState: AuthInitialState = {
  isAuthenticated: false,
  loading: false,
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
    case REGISTER_FAIL:
    case LOGIN_FAIL:
    case USER_LOAD_FAIL:
      return {
        ...state,
        isAuthenticated: false,
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
    default:
      return state;
  }
};

export default authReducer;
