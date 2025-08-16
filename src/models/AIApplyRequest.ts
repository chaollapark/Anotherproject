import mongoose from 'mongoose';

const aiApplyRequestSchema = new mongoose.Schema({
  cvFileId: {
    type: String,
    required: true,
  },
  cvFileUrl: {
    type: String,
    required: true,
  },
  packageType: {
    type: String,
    enum: ['trial', 'full'],
    required: true,
  },
  applicationsRequested: {
    type: Number,
    required: true,
  },
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
