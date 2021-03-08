import { Request, Response } from 'express';
import { request } from '@octokit/request';

import { existAdmin } from '../services/checkPermission';
import Project from '../models/Project';
import Github from '../models/Github';

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
      const newRepo = await Github.create({
        project: req.params.projectId,
        repositoryName,
      });

      return res.status(201).json(newRepo);
    }

    github.repositoryName = repositoryName;
    await github.save();

    res.status(200).json(github);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};
