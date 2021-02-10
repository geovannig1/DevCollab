import { Schema, model, Document } from 'mongoose';

export interface IDiscussion extends Document {
  project: string;
  title: string;
  description?: string;
  attachment?: string;
}

const discussionSchema = new Schema<IDiscussion>({
  project: {
    type: Schema.Types.ObjectId,
    ref: 'Project',
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  attachment: {
    type: String,
  },
});

export default model<IDiscussion>('Discussion', discussionSchema);
