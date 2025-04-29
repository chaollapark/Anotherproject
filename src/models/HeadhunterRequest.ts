import mongoose from 'mongoose';

const headhunterRequestSchema = new mongoose.Schema({
  tier: {
    type: String,
    required: true,
  },
  companyName: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
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
  notes: String,
  status: {
    type: String,
    enum: ['pending', 'paid', 'completed', 'cancelled'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.models.HeadhunterRequest || mongoose.model('HeadhunterRequest', headhunterRequestSchema);
