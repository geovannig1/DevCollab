import { Schema, model, Document } from 'mongoose';

export enum AccessPermission {
  Admin,
  ReadWriteDelete,
  ReadOnly,
}

export interface Member {
  user?: string;
  email?: string;
  accessPermission: AccessPermission;
}

export interface IProject extends Document {
  name: string;
  description?: string;
  members: Member[];
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
      email: {
        type: String,
      },
      accessPermission: {
        type: AccessPermission,
        required: true,
      },
    },
  ],
  date: {
    type: Date,
    default: Date.now,
  },
});

export default model<IProject>('Project', projectSchema);
