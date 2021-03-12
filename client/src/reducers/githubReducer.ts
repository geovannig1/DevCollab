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
  COMMIT_NOTIFIED,
  EVENT_LOADED,
  PullTypes,
} from '../actions/githubTypes';

export interface GithubInitialState {
  repos?: RepoTypes[];
  repo?: RepoTypes;
  commit?: { pageInfo?: PageInfo; commits: CommitTypes[] };
  pull?: { pageInfo?: PageInfo; pulls: PullTypes[] };
  events?: { totalCommit: number };
  commitEvent?: number;
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
    case COMMIT_NOTIFIED:
      return { ...state, commitEvent: action.payload };
    case EVENT_LOADED:
      return { ...state, events: action.payload };
    case CLEAR_GITHUB:
      return {
        githubError: undefined,
        repos: undefined,
        repo: undefined,
        commit: undefined,
        pull: undefined,
        events: undefined,
        commitEvent: undefined,
      };
    default:
      return state;
  }
};

export default githubReducer;
