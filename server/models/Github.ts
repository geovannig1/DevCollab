import { Schema, model, Document } from 'mongoose';

export interface IGithub extends Document {
  project: string;
  repositoryName: string;
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
});

export default model<IGithub>('Github', githubSchema);
