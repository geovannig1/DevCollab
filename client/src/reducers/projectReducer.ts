import {
  PROJECT_LOADED,
  PROJECT_CLEAR,
  PROJECT_CREATED,
  PROJECT_ERROR,
  PROJECT_DELETED,
  ProjectDispatchTypes,
  ProjectType,
} from '../actions/projectTypes';

export interface ProjectInitialState {
  shownProject?: ProjectType[];
  projectError?: object;
}

const projectInitialState: ProjectInitialState = {};

const projectReducer = (
  state = projectInitialState,
  action: ProjectDispatchTypes
): ProjectInitialState => {
  switch (action.type) {
    case PROJECT_LOADED:
      return { ...state, shownProject: action.payload };
    case PROJECT_CREATED:
      return {
        ...state,
        shownProject: [action.payload, ...state.shownProject!],
      };
    case PROJECT_CLEAR:
      return { ...state, shownProject: undefined };
    case PROJECT_DELETED:
      return {
        ...state,
        shownProject: state.shownProject!.filter(
          (project) => project._id !== action.payload
        ),
      };
    case PROJECT_ERROR:
      return { ...state, projectError: action.payload };
    default:
      return state;
  }
};

export default projectReducer;
