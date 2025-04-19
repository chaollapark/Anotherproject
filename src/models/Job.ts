// Job.js
const mongoose = require('mongoose');

function generateSlug(title, companyName, id) {
  const processString = (str) =>
    (str || '')
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();

  const titleSlug   = processString(title)       || 'untitled';
  const companySlug = processString(companyName) || 'unknown-company';
  const shortId     = id.slice(-6);
  return `${titleSlug}-at-${companySlug}-${shortId}`;
}

const JobSchema = new mongoose.Schema({
  title:        { type: String },
  slug:         { type: String, unique: true, sparse: true },
  description:  { type: String, required: true },
  companyName:  { type: String },
  type:         { type: String },
  salary:       { type: Number },
  country:      { type: String },
  state:        { type: String },
  city:         { type: String },
  countryId:    { type: String },
  stateId:      { type: String },
  cityId:       { type: String },
  postalCode:   { type: Number },
  street:       { type: String },
  jobIcon:      { type: String },
  contactName:  { type: String },
  contactPhone: { type: String },
  contactEmail: { type: String },
  applyLink:    { type: String },
  source:       { type: String },
  expiresOn:    { type: String },

  // Optional dedupe field: only indexed/enforced when present
  relativeLink: {
    type:   String,
    unique: true,
    sparse: true
  },

  seniority: {
    type: String,
    enum: ['intern', 'junior', 'mid-level', 'senior'],
    required: true,
  },
  userWorkosId: { type: String },
  plan: {
    type: String,
    enum: ['pending', 'basic', 'pro', 'recruiter', 'unlimited'],
    default: 'pending',
  },
}, { timestamps: true });

// Build sparse unique index on relativeLink
JobSchema.index({ relativeLink: 1 }, { unique: true, sparse: true });

// Pre-save slug generation
JobSchema.pre('save', function (next) {
  if (this.isModified('title') || this.isModified('companyName') || !this.slug) {
    this.slug = generateSlug(this.title, this.companyName, this._id.toString());
  }
  next();
});

const JobModel = mongoose.models.Job || mongoose.model('Job', JobSchema);
module.exports = { JobModel };
