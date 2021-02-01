import { Schema, Document, model } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  havePassword: boolean;
  password?: string;
  googleId?: string;
  avatar?: string;
}

const userSchema = new Schema<IUser>({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  havePassword: {
    type: Boolean,
    default: false,
  },
  password: {
    type: String,
  },
  googleId: {
    type: String,
  },
  avatar: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

userSchema.pre<IUser>('save', async function () {
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(10);

    if (this.password) this.password = await bcrypt.hash(this.password, salt);
  }
});

export default model<IUser>('User', userSchema);
