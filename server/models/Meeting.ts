import { Schema, model, Document } from 'mongoose';

export interface IMeeting extends Document {
  name: string;
  members: {
    email: string;
    avatar: string;
  }[];
}

const meetingSchema = new Schema<IMeeting>({
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
});

export default model<IMeeting>('Meeting', meetingSchema);
