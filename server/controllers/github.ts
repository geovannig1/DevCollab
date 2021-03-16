import { Request, Response } from 'express';
import { request } from '@octokit/request';
import parse from 'parse-link-header';
import crypto from 'crypto';

import { existAdmin, userExist } from '../services/checkPermission';
import Project from '../models/Project';
import Github from '../models/Github';
import { emitter } from '../services/eventEmitter';

//Github webhook controller
export const githubHook = async (req: Request, res: Response) => {
  try {
    //Create a signature
    const expectedSignature =
      'sha256=' +
      crypto
        .createHmac('sha256', process.env.GITHUB_WEBHOOK_SECRET!)
        .update(JSON.stringify(req.body))
        .digest('hex');

    // compare the signature against the one in the request
    const signature = req.headers['x-hub-signature-256'];
    if (signature !== expectedSignature) {
      return res.status(401).json({ msg: 'Unauthorized request' });
    }

    const { repository, ref, pull_request, action } = req.body;

    const github = await Github.findOne({ nodeId: repository.node_id });
    if (!github) {
      return res.status(404).json({ msg: 'Github data not found' });
    }

    //Find members in the project
    const project = await Project.findById(github?.project);
    if (!project) {
      return res.status(404).json({ msg: 'Project not found' });
    }
    const userProject = project.members.map((member) => member.user);

    //Only emit master/main branch and commit event
    if (ref === `refs/heads/${repository.master_branch}` && !pull_request) {
      emitter.commit({ nodeId: repository.node_id });
      //Store the total commit event to each user
      const totalNewCommit = userProject.map((user, index) => {
        if (
          user &&
          (!github.totalNewCommit || !github.totalNewCommit[index]?.commit)
        ) {
          github.totalNewCommit!.push({
            user: user,
            commit: 1,
          });
        } else if (
          github.totalNewCommit &&
          github.totalNewCommit[index]?.commit
        ) {
          github.totalNewCommit[index].commit =
            github.totalNewCommit[index].commit + 1;
        }
        return github.totalNewCommit;
      })[0];

      github.totalNewCommit = totalNewCommit?.map((commit) => commit);
      await github.save();
    }

    if (pull_request && action === 'opened') {
      emitter.pull({ nodeId: repository.node_id });
      //Store the total pull event to database
      const totalNewPull = userProject.map((user, index) => {
        if (
          user &&
          (!github.totalNewPull || !github.totalNewPull[index]?.pull)
        ) {
          github.totalNewPull!.push({
            user: user,
            pull: 1,
          });
        } else if (github.totalNewPull && github.totalNewPull[index]?.pull) {
          github.totalNewPull[index].pull = github.totalNewPull[index].pull + 1;
        }
        return github.totalNewPull;
      })[0];

      github.totalNewPull = totalNewPull?.map((pull) => pull);
      await github.save();
    }

    res.status(200);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

//Get total commit and pull event
export const getEvents = async (req: Request, res: Response) => {
  try {
    const project = await Project.findById(req.params.projectId);

    if (!project) {
      return res.status(404).json({ msg: 'Project not found' });
    }
    //Only user from the project can access the a repository
    const permission = userExist(project, req.user);
    if (!permission) {
      return res.status(401).json({ msg: 'Unauthorized user' });
    }

    const github = await Github.findOne({ project: req.params.projectId });

    if (!github) {
      return res.status(404).json({ msg: 'Github data not found' });
    }

    const userCommit = github.totalNewCommit?.find(
      (commit) => commit.user.toString() === req.user
    );
    const userPull = github.totalNewPull?.find(
      (pull) => pull.user.toString() === req.user
    );

    const event = {
      totalCommit: userCommit?.commit,
      totalPull: userPull?.pull,
    };

    res.status(200).json(event);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

//Remove event
export const removeEvent = async (req: Request, res: Response) => {
  try {
    const project = await Project.findById(req.params.projectId);

    if (!project) {
      return res.status(404).json({ msg: 'Project not found' });
    }
    //Only user from the project can access the a repository
    const permission = userExist(project, req.user);
    if (!permission) {
      return res.status(401).json({ msg: 'Unauthorized user' });
    }

    const { event } = req.body;

    const github = await Github.findOne({ project: req.params.projectId });

    if (!github) {
      return res.status(404).json({ msg: 'Github data not found' });
    }

    if (event === 'commit') {
      //Remove commit event from logged in user
      const userCommit = github.totalNewCommit?.filter(
        (commit) => commit.user.toString() !== req.user
      );

      if (userCommit) {
        github.totalNewCommit = userCommit;
        await github.save();
      }

      return res
        .status(200)
        .json({ msg: 'Commit event of logged in user deleted' });
    }

    if (event === 'pull') {
      //Remove pull event from logged in user
      const userPull = github.totalNewPull?.filter(
        (pull) => pull.user.toString() !== req.user
      );

      if (userPull) {
        github.totalNewPull = userPull;
        await github.save();
      }

      return res
        .status(200)
        .json({ msg: 'Pull event of logged in user deleted' });
    }

    res.status(400).json({ msg: 'Invalid event' });
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

    if (!project.githubAccessToken) {
      return res.status(404).json({ msg: 'Access token not found' });
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

//Get a repo
export const getRepository = async (req: Request, res: Response) => {
  try {
    const project = await Project.findById(req.params.projectId);

    if (!project) {
      return res.status(404).json({ msg: 'Project not found' });
    }
    //Only user from the project can access the a repository
    const permission = userExist(project, req.user);
    if (!permission) {
      return res.status(401).json({ msg: 'Unauthorized user' });
    }

    if (!project.githubAccessToken) {
      return res.status(404).json({ msg: 'Access token not found' });
    }

    //Get the user account
    const user = await request('GET /user', {
      headers: {
        authorization: `token ${project.githubAccessToken}`,
      },
    });

    const github = await Github.findOne({ project: req.params.projectId });
    if (!github) {
      return res.status(404).json({ msg: 'Github data not found' });
    }

    const repository = await request('GET /repos/{owner}/{repo}', {
      owner: user.data.login,
      repo: github.repositoryName,
      headers: {
        authorization: `token ${project.githubAccessToken}`,
      },
    });

    if (!repository) {
      return res.status(404).json({ msg: 'Repository not found' });
    }

    res.status(200).json(repository.data);
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

    if (!project.githubAccessToken) {
      return res.status(404).json({ msg: 'Access token not found' });
    }

    const { repositoryName } = req.body;

    //Get user github
    const user = await request('GET /user', {
      headers: {
        authorization: `token ${project.githubAccessToken}`,
      },
    });

    //Get repository
    const repo = await request('GET /repos/{owner}/{repo}', {
      owner: user.data.login,
      repo: repositoryName,
      headers: {
        authorization: `token ${project.githubAccessToken}`,
      },
    });

    const github = await Github.findOne({ project: req.params.projectId });

    if (!github) {
      await Github.create({
        project: req.params.projectId,
        repositoryName,
        nodeId: repo.data.node_id,
      });

      return res.status(200).json({ msg: 'Repository name stored' });
    }

    github.repositoryName = repositoryName;
    github.nodeId = repo.data.node_id;
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

    if (!project.githubAccessToken) {
      return res.status(404).json({ msg: 'Access token not found' });
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

    if (!project.githubAccessToken) {
      return res.status(404).json({ msg: 'Access token not found' });
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
