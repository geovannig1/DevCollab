import jwt from 'jsonwebtoken';
import { IUser } from '../models/User';

export default (user: IUser) => {
  const payload = {
    user: user.id,
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: '3d',
  });

  return token;
};
