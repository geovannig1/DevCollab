import { Schema, model, Document } from 'mongoose';

export interface IMeeting extends Document {
  project: string;
  name: string;
  members: {
    user?: {
      _id: string;
      firstName: string;
      lastName: string;
    };
    email: string;
    avatar: string;
  }[];
  usersInRoom?: string[];
  iceServer: {
    url: string;
    username: string;
    urls: string;
    credential: string;
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
  usersInRoom: {
    type: [String],
  },
  iceServer: [
    {
      url: String,
      username: String,
      urls: String,
      credential: String,
    },
  ],
  date: {
    type: Date,
    default: Date.now,
  },
});

export default model<IMeeting>('Meeting', meetingSchema);
