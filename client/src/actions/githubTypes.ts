export const REPOSITORIES_LOADED = 'REPOSITORIES_LOADED';
export const REPOSITORY_STORED = 'REPOSITORY_STORED';
export const GITHUB_FAIL = 'GITHUB_FAIl';

export type RepoTypes = {
  id: number;
  name: string;
};

export interface RepositoriesLoaded {
  type: typeof REPOSITORIES_LOADED;
  payload: RepoTypes[];
}

export interface RepositoryStored {
  type: typeof REPOSITORY_STORED;
  payload: RepoTypes;
}

export interface GithubFail {
  type: typeof GITHUB_FAIL;
  payload: { msg: string; status: number };
}

export type GithubDispatchTypes =
  | RepositoriesLoaded
  | RepositoryStored
  | GithubFail;
