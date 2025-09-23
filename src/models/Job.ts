import { model, models, Schema } from 'mongoose';
import mongoose from 'mongoose';
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
  experienceRequirements?: string;
  plan?: string;
  source?: string;
  blockAIApplications?: boolean;
};

function generateSlug(title: string | null | undefined, companyName: string | null | undefined, id: string): string {
  const processString = (str: string | null | undefined, maxLength: number = 50) =>
    (str || '')
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
      .substring(0, maxLength)
      .replace(/-+$/, ''); // Remove trailing dashes

  const titleSlug = processString(title, 30) || 'untitled';
  const companySlug = processString(companyName, 40) || 'unknown-company';
  const shortId = id.slice(-6);

  // Ensure total slug length doesn't exceed 100 characters
  const baseSlug = `${titleSlug}-at-${companySlug}-${shortId}`;
  return baseSlug.length > 100 ? baseSlug.substring(0, 100).replace(/-+$/, '') : baseSlug;
}

const JobSchema = new Schema({
  title: { type: String },
  slug: { 
    type: String,
    unique: true,
    sparse: true,
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
  postalCode: { type: Number },
  street: { type: String },
  jobIcon: { type: String },
  contactName: { type: String },
  contactPhone: { type: String },
  contactEmail: { type: String },
  applyLink: { type: String },
  source: { type: String },
  expiresOn: { type: String },
  seniority: {
    type: String,
    enum: ["intern", "junior", "mid-level", "senior"],
    required: true,
  },
  plan: {
    type: String,
    enum: ['pending', 'basic', 'pro', 'recruiter', 'unlimited'],
    default: 'pending',
  },
  blockAIApplications: {
    type: Boolean,
    default: true, // Default to blocking AI applications
  }
}, { timestamps: true });

JobSchema.pre('save', function(next) {
  if (this.isModified('title') || this.isModified('companyName') || !this.slug) {
    this.slug = generateSlug(this.title, this.companyName, this._id.toString());
  }
  next();
});

export const JobModel = models?.Job || model('Job', JobSchema);

export async function fetchJobs(limit: number = 10) {
  try {
    await dbConnect();

    const proJobs = await JobModel.find(
      { plan: ['recruiter', 'pro'] },
      {},
      { sort: '-createdAt', limit }
    );

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

    return JSON.parse(JSON.stringify([...proJobs, ...otherJobs]));
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return [];
  }
}

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

  const featuredJobs = await JobModel.find(
    { plan: { $in: ['pro', 'recruiter'] } },
    {},
    { sort: '-createdAt', limit: 5 }
  );

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

export async function fetchJobsByCity(cityName: string) {
  await dbConnect();

  const featuredJobs = await JobModel.find(
    { plan: { $in: ['pro', 'recruiter'] } },
    {},
    { sort: '-createdAt', limit: 5 }
  );

  const regularJobs = await JobModel.find(
    {
      city: { $regex: new RegExp(cityName, 'i') },
      plan: { $nin: ['pro', 'recruiter', 'pending'] }
    },
    {},
    { sort: '-createdAt', limit: 50 }
  );

  return JSON.parse(JSON.stringify([...featuredJobs, ...regularJobs]));
}

export async function getAllJobSlugs() {
  try {
    await dbConnect();
    const jobs = await JobModel.find({}, 'slug');
    return jobs
      .map(job => job.slug)
      .filter(Boolean) // Filter out any undefined/null slugs
      .filter(slug => slug.length <= 100); // Filter out overly long slugs that cause build issues
  } catch (error) {
    console.error('Error fetching all job slugs:', error);
    return [];
  }
}
