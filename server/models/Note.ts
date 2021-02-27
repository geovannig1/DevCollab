import { Schema, model, Document } from 'mongoose';

interface Note extends Document {
  project: string;
  title: string;
  contents: string;
  user: string;
}

const noteSchema = new Schema<Note>({
  project: {
    type: Schema.Types.ObjectId,
    required: true,
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

export default model<Note>('Note', noteSchema);
