import {
  PROJECT_LOADED,
  PROJECT_CLEAR,
  PROJECT_CREATED,
  PROJECT_UPDATED,
  PROJECT_ERROR,
  PROJECT_DELETED,
  ProjectDispatchTypes,
  ProjectType,
} from '../actions/projectTypes';

export interface ProjectInitialState {
  projects?: ProjectType[];
  selectedProject?: ProjectType;
  projectError?: object;
}

const projectInitialState: ProjectInitialState = {};

const projectReducer = (
  state = projectInitialState,
  action: ProjectDispatchTypes
): ProjectInitialState => {
  switch (action.type) {
    case PROJECT_LOADED:
      return { ...state, projects: action.payload };
    case PROJECT_CREATED:
      return {
        ...state,
        projects: [...(state.projects ? state.projects : []), action.payload],
      };
    case PROJECT_UPDATED:
      return {
        ...state,
        projects:
          state.projects &&
          state.projects.map((project) => {
            if (project._id.toString() === action.payload.id) {
              return { ...project, ...action.payload.project };
            }
            return project;
          }),
      };
    case PROJECT_CLEAR:
      return {};
    case PROJECT_DELETED:
      return {
        ...state,
        projects:
          state.projects &&
          state.projects.filter((project) => project._id !== action.payload),
      };
    case PROJECT_ERROR:
      return { ...state, projectError: action.payload };
    default:
      return state;
  }
};

export default projectReducer;
