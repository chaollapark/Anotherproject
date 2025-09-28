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
  originalName: {
    type: String,
  },
  description: {
    type: String,
  },
  goals: {
    type: String,
  },
  website: {
    type: String,
  },
  webSiteURL: {
    type: String,
  },
  interests: [{
    type: String,
  }],
  levelsOfInterest: [{
    type: String,
  }],
  interestRepresented: {
    type: String,
  },
  registrationCategory: {
    type: String,
  },
  // Add other fields that are actually used
  acronym: String,
  identificationCode: String,
  EPAccreditedNumber: mongoose.Schema.Types.Mixed,
  EULegislativeProposals: String,
  EUOffice: mongoose.Schema.Types.Mixed,
  EUSupportedForumsAndPlatforms: String,
  communicationActivities: String,
  entityForm: String,
  financialData: mongoose.Schema.Types.Mixed,
  headOffice: mongoose.Schema.Types.Mixed,
  interOrUnofficalGroupings: String,
  lastUpdateDate: Date,
  members: mongoose.Schema.Types.Mixed,
  rawXML: String,
  registrationDate: Date,
  structure: mongoose.Schema.Types.Mixed,
  structureType: String,
  isMemberOf: String,
  organisationMembers: String,
}, {
  timestamps: true, // Adds createdAt and updatedAt timestamps
  collection: 'eu_interest_representatives', // Explicitly set collection name
  strict: false // Allow fields not defined in schema since this is a flexible collection
});

// Ensure the model is not recompiled if it already exists
export default mongoose.models.LobbyingEntity || mongoose.model('LobbyingEntity', LobbyingEntitySchema);
