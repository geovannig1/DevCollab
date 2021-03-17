import { Schema, model, Document } from 'mongoose';

export interface IGithub extends Document {
  project: string;
  repositoryName: string;
  nodeId: string;
  totalNewCommit?: {
    user: string;
    commit: number;
  }[];
  totalNewPull?: {
    user: string;
    pull: number;
  }[];
}

const githubSchema = new Schema<IGithub>({
  project: {
    type: Schema.Types.ObjectId,
    ref: 'Project',
  },
  repositoryName: {
    type: String,
    required: true,
  },
  nodeId: {
    type: String,
    required: true,
  },
  totalNewCommit: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
      commit: {
        type: Number,
        default: 0,
      },
    },
  ],
  totalNewPull: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
      pull: {
        type: Number,
        default: 0,
      },
    },
  ],
});

export default model<IGithub>('Github', githubSchema);
