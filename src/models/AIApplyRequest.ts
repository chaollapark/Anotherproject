import mongoose from 'mongoose';

const aiApplyRequestSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  cv: {
    type: String,
    required: true,
  },
  preferences: String,
  status: {
    type: String,
    enum: ['pending', 'paid', 'processing', 'completed', 'cancelled'],
    default: 'pending'
  },
  applicationsSent: {
    type: Number,
    default: 0
  },
  applicationsApproved: {
    type: Number,
    default: 0
  },
  responsesReceived: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.models.AIApplyRequest || mongoose.model('AIApplyRequest', aiApplyRequestSchema);
