import {
  REPOSITORIES_LOADED,
  REPOSITORY_LOADED,
  COMMITS_LOADED,
  REPOSITORY_STORED,
  PULLS_LOADED,
  GITHUB_FAIL,
  GithubDispatchTypes,
  RepoTypes,
  CommitTypes,
  PageInfo,
  CLEAR_GITHUB,
  PullTypes,
} from '../actions/githubTypes';

export interface GithubInitialState {
  repos?: RepoTypes[];
  repo?: RepoTypes;
  commit?: { pageInfo?: PageInfo; commits: CommitTypes[] };
  pull?: { pageInfo?: PageInfo; pulls: PullTypes[] };
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
    case REPOSITORY_LOADED:
      return { ...state, repo: action.payload };
    case REPOSITORY_STORED:
      return { ...state };
    case COMMITS_LOADED:
      return { ...state, commit: action.payload, pull: undefined };
    case PULLS_LOADED:
      return { ...state, pull: action.payload, commit: undefined };
    case GITHUB_FAIL:
      return { ...state, githubError: action.payload };
    case CLEAR_GITHUB:
      return {
        githubError: undefined,
        repos: undefined,
        repo: undefined,
        commit: undefined,
        pull: undefined,
      };
    default:
      return state;
  }
};

export default githubReducer;
