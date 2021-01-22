import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

export default (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies['access_token'];

    if (!token) {
      return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!);

    req.user = decoded.user;

    next();
  } catch (err) {
    console.error(err.message);
    res.status(401).json({ msg: 'invalid token' });
  }
};
