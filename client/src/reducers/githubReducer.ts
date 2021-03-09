import {
  REPOSITORIES_LOADED,
  COMMITS_LOADED,
  REPOSITORY_STORED,
  GITHUB_FAIL,
  GithubDispatchTypes,
  RepoTypes,
  CommitTypes,
  PageInfo,
} from '../actions/githubTypes';

export interface GithubInitialState {
  repos?: RepoTypes[];
  commit?: { pageInfo: PageInfo; commits: CommitTypes[] };
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
    case COMMITS_LOADED:
      return { ...state, commit: action.payload };
    case REPOSITORY_STORED:
      return { ...state };
    case GITHUB_FAIL:
      return { ...state, githubError: action.payload };
    default:
      return state;
  }
};

export default githubReducer;
