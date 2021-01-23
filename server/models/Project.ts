import { Schema, model, Document } from 'mongoose';

import { IUser } from './User';

export enum AccessPermission {
  Admin,
  Read,
  ReadWriteDelete,
}

export interface IProject extends Document {
  name: string;
  description: string;
  members: {
    [index: number]: {
      user: IUser;
      accessPermisson: AccessPermission;
    };
  };
}

const projectSchema = new Schema<IProject>({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  members: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
      accessPersmision: {
        type: AccessPermission,
        required: true,
      },
    },
  ],
});

export default model<IProject>('Project', projectSchema);
