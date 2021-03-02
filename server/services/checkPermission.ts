import { Request, Response } from 'express';

import { IProject } from '../models/Project';

//check whether the user is from the project or not
export const userExist = (req: Request, res: Response, project: IProject) => {
  const userExist = project?.members.filter(
    (member: any) => member.user?._id.toString() === req.user
  );
  if (userExist?.length === 0) {
    return res.status(401).json({ msg: 'Unauthorized user' });
  }
};

//check whether the user is from the project or not and the access permission is not ReadOnly
export const existNotReadOnly = (
  req: Request,
  res: Response,
  project: IProject
) => {
  const userExist = project?.members.filter(
    (member: any) => member.user?._id.toString() === req.user
  );
  if (userExist?.length === 0) {
    return res.status(401).json({ msg: 'Unauthorized user' });
  }
};
