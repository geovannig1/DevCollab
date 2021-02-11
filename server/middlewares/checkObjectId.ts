import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';

export default (id: string) => (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!mongoose.Types.ObjectId.isValid(req.params[id])) {
    return res.status(400).json({ msg: 'Invalid id' });
  }
  next();
};
