import mongoose from 'mongoose';

const LobbyingEntitySchema = new mongoose.Schema({
  slug: {
    type: String,
    required: [true, 'Please provide a slug for the entity.'],
    unique: true,
    index: true,
  },
  name: {
    type: String,
    required: [true, 'Please provide a name for the entity.'],
  },
  description: {
    type: String,
  },
  website: {
    type: String,
  },
  // You can add other fields from your eu_interest_representatives collection here
  // For example:
  // identifier: String, // Official identifier if any
  // registrationDate: Date,
  // categories: [String],
  // address: {
  //   street: String,
  //   city: String,
  //   postalCode: String,
  //   country: String,
  // },
  // contact: {
  //   email: String,
  //   phone: String,
  // },
  // financialData: mongoose.Schema.Types.Mixed, // For complex, less structured data
}, {
  timestamps: true, // Adds createdAt and updatedAt timestamps
  collection: 'eu_interest_representatives' // Explicitly set collection name
});

// Ensure the model is not recompiled if it already exists
export default mongoose.models.LobbyingEntity || mongoose.model('LobbyingEntity', LobbyingEntitySchema);
