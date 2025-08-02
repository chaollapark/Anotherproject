import { model, models, Schema } from 'mongoose';

export type Subscriber = {
  _id: string;
  email: string;
  isSubscribed: boolean;
  createdAt: string;
  updatedAt: string;
};

const SubscriberSchema = new Schema({
  email: { 
    type: String, 
    required: true, 
    unique: true,
    trim: true,
    lowercase: true,
  },
  isSubscribed: {
    type: Boolean,
    default: true,
  }
}, { timestamps: true });

export const SubscriberModel = models?.Subscriber || model('Subscriber', SubscriberSchema);
