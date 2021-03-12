import { Schema, model, Document } from 'mongoose';

export interface IGithub extends Document {
  project: string;
  repositoryName: string;
  nodeId: string;
  totalNewCommit?: number;
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
  totalNewCommit: {
    type: Number,
    default: 0,
  },
});

export default model<IGithub>('Github', githubSchema);
