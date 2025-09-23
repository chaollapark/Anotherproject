import mongoose, { model, models, Schema } from 'mongoose';

interface IUser {
  email: string;
  name: string;
  isJobPoster: boolean;
  isProfileComplete: boolean;
}

const UserSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  isJobPoster: { type: Boolean, required: true },
  isProfileComplete: { type: Boolean, required: false, default: false },
}, {
  timestamps: true,
});

export const UserModel = models?.User || model<IUser>('User', UserSchema);
export type User = mongoose.Document & IUser;
