import {
  REPOSITORIES_LOADED,
  REPOSITORY_LOADED,
  COMMITS_LOADED,
  REPOSITORY_STORED,
  PULLS_LOADED,
  GITHUB_FAIL,
  COMMIT_NOTIFIED,
  PULL_NOTIFIED,
  EVENT_LOADED,
  CLEAR_GITHUB,
  EVENT_REMOVED,
  GithubDispatchTypes,
  RepoTypes,
  CommitTypes,
  PageInfo,
  PullTypes,
} from '../actions/githubTypes';

export interface GithubInitialState {
  repos?: RepoTypes[];
  repo?: RepoTypes;
  commit?: { pageInfo?: PageInfo; commits: CommitTypes[] };
  pull?: { pageInfo?: PageInfo; pulls: PullTypes[] };
  events?: { totalCommit: number; totalPull: number };
  commitEvent?: number;
  pullEvent?: number;
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
      return { ...state, commit: action.payload };
    case PULLS_LOADED:
      return { ...state, pull: action.payload };
    case GITHUB_FAIL:
      return { ...state, githubError: action.payload };
    case COMMIT_NOTIFIED:
      return { ...state, commitEvent: action.payload };
    case PULL_NOTIFIED:
      return { ...state, pullEvent: action.payload };
    case EVENT_LOADED:
      return { ...state, events: action.payload };
    case EVENT_REMOVED:
      return action.payload === 'commit'
        ? {
            ...state,
            commitEvent: undefined,
            events: { totalCommit: 0, totalPull: state.events?.totalPull ?? 0 },
          }
        : {
            ...state,
            pullEvent: undefined,
            events: {
              totalPull: 0,
              totalCommit: state.events?.totalCommit ?? 0,
            },
          };
    case CLEAR_GITHUB:
      return {
        githubError: undefined,
        repos: undefined,
        repo: undefined,
        commit: undefined,
        pull: undefined,
        events: undefined,
        commitEvent: undefined,
        pullEvent: undefined,
      };
    default:
      return state;
  }
};

export default githubReducer;
