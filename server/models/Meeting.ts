import { Schema, model, Document } from 'mongoose';

interface UsersInRoom {
  [name: string]: string[];
}

interface UserToRoom {
  [name: string]: string;
}

export interface IMeeting extends Document {
  project: string;
  name: string;
  members: {
    user?: string;
    email: string;
    avatar: string;
  }[];
  usersInRoom?: UsersInRoom;
  userToRoom?: UserToRoom;
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
    type: Map,
    of: [String],
  },
  userToRoom: {
    type: Map,
    of: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

export default model<IMeeting>('Meeting', meetingSchema);
