import {
  REPOSITORIES_LOADED,
  GITHUB_FAIL,
  GithubDispatchTypes,
  REPOSITORY_STORED,
  RepoTypes,
} from '../actions/githubTypes';

export interface GithubInitialState {
  repos?: RepoTypes[];
  repo?: RepoTypes;
  githubError?: { msg: string; status: number };
}

const githubInitialState: GithubInitialState = {};

const githubReducer = (
  state = githubInitialState,
  action: GithubDispatchTypes
): GithubInitialState => {
  switch (action.type) {
    case REPOSITORIES_LOADED:
      return { ...state, repos: action.payload };
    case REPOSITORY_STORED:
      return { ...state, repo: action.payload };
    case GITHUB_FAIL:
      return { ...state, githubError: action.payload };
    default:
      return state;
  }
};

export default githubReducer;
