import {
  PROJECT_LOADED,
  PROJECT_CLEAR,
  ProjectDispatchTypes,
  ProjectType,
} from '../actions/projectTypes';

export interface ProjectInitialState {
  shownProject?: ProjectType;
}

const projectInitialState: ProjectInitialState = {};

const projectReducer = (
  state = projectInitialState,
  action: ProjectDispatchTypes
): ProjectInitialState => {
  switch (action.type) {
    case PROJECT_LOADED:
      return { ...state, shownProject: action.payload };
    case PROJECT_CLEAR:
      return { ...state, shownProject: undefined };
    default:
      return state;
  }
};

export default projectReducer;
