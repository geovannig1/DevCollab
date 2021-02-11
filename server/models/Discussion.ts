import { Schema, model, Document } from 'mongoose';

export interface IDiscussion extends Document {
  project: string;
  title: string;
  description?: string;
  attachment?: {
    url: string;
    publicId: string;
  };
  creator: string;
  chats?: {
    user: {
      email: string;
      avatar: string;
    };
    chat: string;
  }[];
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
    url: String,
    publicId: String,
  },
  creator: {
    type: String,
    required: true,
  },
  chats: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
      chat: {
        type: String,
      },
      date: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  date: {
    type: Date,
    default: Date.now,
  },
});

export default model<IDiscussion>('Discussion', discussionSchema);
