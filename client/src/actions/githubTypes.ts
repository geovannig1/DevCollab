export const REPOSITORIES_LOADED = 'REPOSITORIES_LOADED';
export const REPOSITORY_STORED = 'REPOSITORY_STORED';
export const COMMITS_LOADED = 'COMMITS_LOADED';
export const GITHUB_FAIL = 'GITHUB_FAIl';

export type RepoTypes = {
  id: number;
  name: string;
};

export type CommitTypes = {
  node_id: string;
  html_url: string;
  committer: {
    avatar_url: string;
  };
  commit: {
    message: string;
    comment_count: number;
    committer: {
      name: string;
      email: string;
      date: Date;
    };
  };
};

export interface PageInfo {
  next?: { page: number };
  prev?: { page: number };
  last?: { page: number };
}

export interface RepositoriesLoaded {
  type: typeof REPOSITORIES_LOADED;
  payload: RepoTypes[];
}

export interface RepositoryStored {
  type: typeof REPOSITORY_STORED;
}

export interface CommitsLoaded {
  type: typeof COMMITS_LOADED;
  payload: {
    pageInfo: PageInfo;
    commits: CommitTypes[];
  };
}

export interface GithubFail {
  type: typeof GITHUB_FAIL;
  payload: { msg: string; status: number };
}

export type GithubDispatchTypes =
  | RepositoriesLoaded
  | RepositoryStored
  | CommitsLoaded
  | GithubFail;
