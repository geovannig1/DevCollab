import { Schema, Document, model } from 'mongoose';

interface IFile extends Document {
  project: string;
  name: string;
  file: {
    url: string;
    publicId: string;
  };
  user: string;
}

const fileSchema = new Schema<IFile>({
  project: {
    type: Schema.Types.ObjectId,
    ref: 'Project',
  },
  name: {
    type: String,
    required: true,
  },
  file: {
    url: String,
    publicId: String,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

export default model<IFile>('File', fileSchema);
