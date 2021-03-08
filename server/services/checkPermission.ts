import { AccessPermission, IProject } from '../models/Project';

//check whether the user is from the project or not
export const userExist = (project: IProject, user?: Express.User) => {
  const userExist = project?.members.filter(
    (member: any) => member.user?._id.toString() === user
  );
  if (userExist?.length === 0) {
    return false;
  }

  return true;
};

//check whether the user is from the project or not and the access permission is not ReadOnly
export const existNotReadOnly = (project: IProject, user?: Express.User) => {
  const userExist = project?.members.filter(
    (member: any) => member.user?._id.toString() === user
  );
  if (
    userExist?.length === 0 ||
    userExist?.[0].accessPermission === AccessPermission.ReadOnly
  ) {
    return false;
  }

  return true;
};

//check whether the user is from the project or not and the access permission is Admin
export const existAdmin = (project: IProject, user?: Express.User) => {
  const userExist = project?.members.filter(
    (member: any) => member.user?._id.toString() === user
  );
  if (
    userExist?.length !== 0 &&
    userExist?.[0].accessPermission === AccessPermission.Admin
  ) {
    return true;
  }

  return false;
};
