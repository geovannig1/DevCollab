import { combineReducers } from 'redux';
import authReducer from './authReducer';
import alertReducer from './alertReducer';
import projectReducer from './projectReducer';

export default combineReducers({
  auth: authReducer,
  alert: alertReducer,
  project: projectReducer,
});
