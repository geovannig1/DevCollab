import { combineReducers } from 'redux';
import authReducer from './authReducer';
import alertReducer from './alertReducer';
import projectReducer from './projectReducer';
import navbarReducer from './navbarReducer';
import discussionReducer from './discussionReducer';
import meetingReducer from './meetingReducer';
import displayReducer from './displayReducer';
import noteReducer from './noteReducer';
import fileReducer from './fileReducer';

export default combineReducers({
  auth: authReducer,
  alert: alertReducer,
  project: projectReducer,
  navbar: navbarReducer,
  discussion: discussionReducer,
  meeting: meetingReducer,
  display: displayReducer,
  note: noteReducer,
  file: fileReducer,
});
