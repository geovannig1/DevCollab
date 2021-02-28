import { Schema, model, Document } from 'mongoose';

interface INote extends Document {
  project: string;
  title: string;
  contents: string;
  user: string;
}

const noteSchema = new Schema<INote>({
  project: {
    type: Schema.Types.ObjectId,
    ref: 'Project',
  },
  title: {
    type: String,
    required: true,
  },
  contents: {
    type: String,
    required: true,
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

export default model<INote>('Note', noteSchema);
