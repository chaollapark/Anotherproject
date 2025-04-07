import { model, models, Schema } from 'mongoose';
import dbConnect from '@/lib/dbConnect';

export type Job = {
  _id: string;
  title: string;
  slug: string;  
  description: string;
  companyName: string;
  remote: string;
  type: string;
  salary: number;
  country: string;
  state: string;
  city: string;
  countryId: string;
  stateId: string;
  cityId: string;
  jobIcon: string;
  postalCode: number;
  street: string;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  applyLink: string;  
  createdAt: string;
  updatedAt: string;
  expiresOn: string;
  seniority: string;
  plan?: string;
  userWorkosId?: string;
  source?: string;
};

function generateSlug(title: string | null | undefined, companyName: string | null | undefined, id: string): string {
  // Convert to lowercase and remove special characters
  const processString = (str: string | null | undefined) => 
    (str || '')  // Use empty string if null/undefined
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  const titleSlug = processString(title) || 'untitled';  // Default value if empty
  const companySlug = processString(companyName) || 'unknown-company';  // Default value if empty
  const shortId = id.slice(-6);
  return `${titleSlug}-at-${companySlug}-${shortId}`;
}

// -----------------------------
// Schema & Model
// -----------------------------

const JobSchema = new Schema({
  title: { type: String },
  slug: { 
    type: String,
    unique: true,
    sparse: true  // Allows null/undefined values
  },
  description: { type: String, required: true },
  companyName: { type: String },
  type: { type: String },
  salary: { type: Number },
  country: { type: String },
  state: { type: String },
  city: { type: String },
  countryId: { type: String },
  stateId: { type: String },
  cityId: { type: String },
  postalCode: { type: Number, required: false},
  street: {type: String, required: false},
  jobIcon: { type: String },
  contactName: { type: String },
  contactPhone: { type: String },
  contactEmail: { type: String },
  expiresOn: {type: String, required: false},
  applyLink: { type: String, required: false},
  seniority: { 
    type: String,
    enum: ["intern", "junior", "mid-level", "senior"],
    required: true
  },
  userWorkosId: { type: String, required: false },
  source: { type: String, required: false },
  plan: {
    type: String, 
    enum: ['pending', 'basic', 'pro', 'recruiter', 'unlimited'],
    required: false,
    default: 'pending'
  }
}, {
  timestamps: true
});

// Pre-save middleware to generate slug
JobSchema.pre('save', function(next) {
  if (this.isModified('title') || this.isModified('companyName') || !this.slug) {
    this.slug = generateSlug(this.title, this.companyName, this._id.toString());
  }
  next();
});

// Add an index for slug
// JobSchema.index({ slug: 1 }); This was creating problems because it was creating another problem - when I remember I'm going to compalain to mongoDB because it's not htere fucking busienss to tell me to write efficient code, I need to push things fast.

export const JobModel = models?.Job || model('Job', JobSchema);

// -----------------------------
// Fetching Functions
// -----------------------------

// Updated fetchJobs function
export async function fetchJobs(limit: number = 10) {
  try {
    await dbConnect();
    
    // First, fetch pro jobs
    const proJobs = await JobModel.find(
      { plan:  ['recruiter','pro'] },
      {},
      { sort: '-createdAt', limit }
    );
    
    // Then, fetch basic jobs (excluding both pro and pending)
    const remainingLimit = limit - proJobs.length;
    const otherJobs = await JobModel.find(
      { 
        plan: { 
          $nin: ['pro', 'pending', 'recruiter']
        }
      },
      {},
      { sort: '-createdAt', limit: remainingLimit }
    );
    
    const allJobs = [...proJobs, ...otherJobs];
    return JSON.parse(JSON.stringify(allJobs));
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return [];
  }
}

// Add a function to find job by slug
export async function findJobBySlug(slug: string) {
  try {
    await dbConnect();
    const job = await JobModel.findOne({ slug });
    return job ? JSON.parse(JSON.stringify(job)) : null;
  } catch (error) {
    console.error('Error finding job by slug:', error);
    return null;
  }
}

export async function fetchJobsBySource(source: string) {
  await dbConnect();

  // ✅ 1. Fetch global featured jobs (no source filtering)
  const featuredJobs = await JobModel.find(
    { plan: { $in: ['pro', 'recruiter'] } },
    {},
    { sort: '-createdAt', limit: 5 }
  );

  // ✅ 2. Fetch regular jobs for that specific source (excluding featured)
  const regularJobs = await JobModel.find(
    {
      source,
      plan: { $nin: ['pro', 'recruiter', 'pending'] }
    },
    {},
    { sort: '-createdAt', limit: 50 }
  );

  return JSON.parse(JSON.stringify([...featuredJobs, ...regularJobs]));
}
