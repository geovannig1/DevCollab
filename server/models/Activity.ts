import { Schema, model, Document } from 'mongoose';

export enum Avatar {
  task,
  discussion,
  meeting,
  github,
  note,
  file,
}

export interface IActivity extends Document {
  project: string;
  messages: {
    _id?: number;
    user?: string;
    avatar?: number;
    name?: string;
    message: string;
  }[];
  notifications?: {
    _id?: string;
    user: string;
    totalNotifications: number;
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
      avatar: {
        type: Number,
      },
      name: {
        type: String,
      },
      date: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  notifications: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
      totalNotifications: {
        type: Number,
        default: 0,
      },
    },
  ],
  date: {
    type: Date,
    default: Date.now,
  },
});

export default model<IActivity>('Activity', activitySchema);
