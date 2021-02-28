import { Schema, Document, model } from 'mongoose';

interface IFile extends Document {
  project: string;
  name: string;
  file: {
    url: string;
    publicId: string;
  };
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
});

export default model<IFile>('File', fileSchema);
