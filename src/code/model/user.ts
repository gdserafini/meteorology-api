import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import AuthService from '@src/code/service/auth';

export interface User {
  _id?: string;
  name: string;
  email: string;
  password: string;
}

export enum CustomValidation {
  DUPLICATED = 'DUPLICATED',
}

const schema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: { type: String, required: true },
  },
  {
    toJSON: {
      transform: (_, ret): void => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

schema.path('email').validate(
  async (email: string) => {
    const emailCount = await mongoose.models.User.countDocuments({ email });
    return !emailCount;
  },
  'already exists in the data base.',
  CustomValidation.DUPLICATED
);

schema.pre<User>('save', async function (): Promise<void> {
  if (!this.password) return;
  try {
    const hashedPassword = await AuthService.hashPassword(this.password);
    this.password = hashedPassword;
  } catch (err) {
    console.error(`Error hashing the password for the user ${this.name}`, err);
  }
});

export const User = mongoose.model<User>('User', schema);
