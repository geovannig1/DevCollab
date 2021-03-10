import { Request, Response } from 'express';
import { request } from '@octokit/request';
import parse from 'parse-link-header';

import { existAdmin, userExist } from '../services/checkPermission';
import Project from '../models/Project';
import Github from '../models/Github';

//github webhook
export const githubHook = (req: Request, res: Response) => {
  try {
    console.log(req.body);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

//To get all the repositories
export const getRepositories = async (req: Request, res: Response) => {
  try {
    const project = await Project.findById(req.params.projectId);

    if (!project) {
      return res.status(404).json({ msg: 'Project not found' });
    }
    //Only user from the project and user with admin access permission can access the repositories
    const permission = existAdmin(project, req.user);
    if (!permission) {
      return res.status(401).json({ msg: 'Unauthorized user' });
    }

    //Request github api repos using octokit
    const response = await request('GET /user/repos', {
      headers: {
        authorization: `token ${project.githubAccessToken}`,
      },
    });
    const repositories = response.data;

    res.status(200).json(repositories);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

//Store chosen repository data
export const storeRepository = async (req: Request, res: Response) => {
  try {
    const project = await Project.findById(req.params.projectId);

    if (!project) {
      return res.status(404).json({ msg: 'Project not found' });
    }
    //Only user from the project and user with admin access permission can access the repositories
    const permission = existAdmin(project, req.user);
    if (!permission) {
      return res.status(401).json({ msg: 'Unauthorized user' });
    }

    const { repositoryName } = req.body;

    const github = await Github.findOne({ project: req.params.projectId });

    if (!github) {
      await Github.create({
        project: req.params.projectId,
        repositoryName,
      });

      return res.status(200).json({ msg: 'Repository name stored' });
    }

    github.repositoryName = repositoryName;
    await github.save();

    res.status(200).json({ msg: 'Repository name stored' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

//Get commits from specific page
export const getCommits = async (req: Request, res: Response) => {
  try {
    const project = await Project.findById(req.params.projectId);

    if (!project) {
      return res.status(404).json({ msg: 'Project not found' });
    }
    //Only user from the project can access the commits
    const permission = userExist(project, req.user);
    if (!permission) {
      return res.status(401).json({ msg: 'Unauthorized user' });
    }

    const github = await Github.findOne({ project: req.params.projectId });

    if (!github) {
      return res.status(404).json({ msg: 'Github data not found' });
    }

    const user = await request('GET /user', {
      headers: {
        authorization: `token ${project.githubAccessToken}`,
      },
    });

    const commits = await request('GET /repos/{owner}/{repo}/commits', {
      owner: user.data.login,
      repo: github.repositoryName,
      per_page: 5,
      page: parseInt(req.params.page),
      headers: {
        authorization: `token ${project.githubAccessToken}`,
      },
    });

    if (!commits) {
      return res.status(404).json({ msg: 'Commits not found' });
    }

    res.status(200).json({
      pageInfo: parse(commits.headers.link ?? ''),
      commits: commits.data,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

//Get pull request from specific page
export const getPulls = async (req: Request, res: Response) => {
  try {
    const project = await Project.findById(req.params.projectId);

    if (!project) {
      return res.status(404).json({ msg: 'Project not found' });
    }
    //Only user from the project can access the commits
    const permission = userExist(project, req.user);
    if (!permission) {
      return res.status(401).json({ msg: 'Unauthorized user' });
    }

    const github = await Github.findOne({ project: req.params.projectId });

    if (!github) {
      return res.status(404).json({ msg: 'Github data not found' });
    }

    const user = await request('GET /user', {
      headers: {
        authorization: `token ${project.githubAccessToken}`,
      },
    });

    const pulls = await request('GET /repos/{owner}/{repo}/pulls', {
      owner: user.data.login,
      repo: github.repositoryName,
      per_page: 5,
      page: parseInt(req.params.page),
      headers: {
        authorization: `token ${project.githubAccessToken}`,
      },
    });

    if (!pulls) {
      return res.status(404).json({ msg: 'Pulls not found' });
    }

    res.status(200).json({
      pageInfo: parse(pulls.headers.link ?? ''),
      pulls: pulls.data,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};
