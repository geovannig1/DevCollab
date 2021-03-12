export const REPOSITORIES_LOADED = 'REPOSITORIES_LOADED';
export const REPOSITORY_LOADED = 'REPOSITORY_LOADED';
export const REPOSITORY_STORED = 'REPOSITORY_STORED';
export const COMMITS_LOADED = 'COMMITS_LOADED';
export const PULLS_LOADED = 'PULLS_LOADED';
export const GITHUB_FAIL = 'GITHUB_FAIl';
export const CLEAR_GITHUB = 'CLEAR_GITHUB';
export const COMMIT_NOTIFIED = 'COMMIT_NOTIFIED';
export const EVENT_LOADED = 'EVENT_LOADED';

export type RepoTypes = {
  node_id: string;
  id: number;
  name: string;
};

export type CommitTypes = {
  node_id: string;
  html_url: string;
  author: {
    avatar_url: string;
  };
  commit: {
    message: string;
    comment_count: number;
    author: {
      name: string;
      email: string;
      date: Date;
    };
  };
};

export type PullTypes = {
  id: number;
  html_url: string;
  title: string;
  created_at: string;
  updated_at: string;
  user: {
    login: string;
    avatar_url: string;
  };
  head: {
    label: string;
    ref: string;
  };
  base: {
    label: string;
    ref: string;
  };
};

export interface PageInfo {
  next?: { page: string };
  prev?: { page: string };
  last?: { page: string };
}

export interface RepositoriesLoaded {
  type: typeof REPOSITORIES_LOADED;
  payload: RepoTypes[];
}

export interface RepositoryLoaded {
  type: typeof REPOSITORY_LOADED;
  payload: RepoTypes;
}

export interface RepositoryStored {
  type: typeof REPOSITORY_STORED;
}

export interface CommitsLoaded {
  type: typeof COMMITS_LOADED;
  payload: {
    pageInfo?: PageInfo;
    commits: CommitTypes[];
  };
}

export interface PullsLoaded {
  type: typeof PULLS_LOADED;
  payload: { pageInfo?: PageInfo; pulls: PullTypes[] };
}

export interface GithubFail {
  type: typeof GITHUB_FAIL;
  payload: { msg: string; status: number };
}

export interface ClearGithub {
  type: typeof CLEAR_GITHUB;
}

export interface CommitNotified {
  type: typeof COMMIT_NOTIFIED;
  payload: number;
}

export interface EventLoaded {
  type: typeof EVENT_LOADED;
  payload: { totalCommit: number };
}

export type GithubDispatchTypes =
  | RepositoriesLoaded
  | RepositoryLoaded
  | RepositoryStored
  | CommitsLoaded
  | PullsLoaded
  | GithubFail
  | ClearGithub
  | CommitNotified
  | EventLoaded;
