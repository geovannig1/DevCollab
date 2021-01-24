import { Schema, model, Document } from 'mongoose';

export enum AccessPermission {
  Admin,
  ReadOnly,
  ReadWriteDelete,
}

export interface Member {
  user: string;
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
      accessPermission: {
        type: AccessPermission,
        required: true,
      },
    },
  ],
});

export default model<IProject>('Project', projectSchema);
