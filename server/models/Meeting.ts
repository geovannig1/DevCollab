import { Schema, model, Document } from 'mongoose';

export interface IMeeting extends Document {
  project: string;
  name: string;
  members: {
    user?: string;
    email: string;
    avatar: string;
  }[];
}

const meetingSchema = new Schema<IMeeting>({
  project: {
    type: Schema.Types.ObjectId,
    ref: 'Project',
  },
  name: {
    type: String,
    required: true,
  },
  members: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    },
  ],
  date: {
    type: Date,
    default: Date.now,
  },
});

export default model<IMeeting>('Meeting', meetingSchema);
