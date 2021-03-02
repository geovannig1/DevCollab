import { Schema, model, Document } from 'mongoose';

interface IActivity extends Document {
  project: string;
  messages: {
    user: string;
    message: string;
  }[];
}

const activitySchema = new Schema<IActivity>({
  project: {
    type: Schema.Types.ObjectId,
    ref: 'Project',
  },
  messages: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
      message: {
        type: String,
        required: true,
      },
    },
  ],
  date: {
    type: Date,
    default: Date.now,
  },
});

export default model<IActivity>('Activity', activitySchema);
