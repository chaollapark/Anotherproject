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
  const processString = (str: string | null | undefined) =>
    (str || '')
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();

  const titleSlug = processString(title) || 'untitled';
  const companySlug = processString(companyName) || 'unknown-company';
  const shortId = id.slice(-6);

  return `${titleSlug}-at-${companySlug}-${shortId}`;
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

export async function fetchJobsBySource(source: string | string[]) {
  await dbConnect();

  const featuredJobs = await JobModel.find(
    { plan: { $in: ['pro', 'recruiter'] } },
    {},
    { sort: '-createdAt', limit: 5 }
  );

  const sourceQuery = Array.isArray(source) ? { $in: source } : source;
  
  const regularJobs = await JobModel.find(
    {
      source: sourceQuery,
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
    return jobs.map(job => job.slug).filter(Boolean); // Filter out any undefined/null slugs
  } catch (error) {
    console.error('Error fetching all job slugs:', error);
    return [];
  }
}

export async function fetchJobsForEntity(entityWebsiteUrl?: string, entityName?: string, limit: number = 3) {
  await dbConnect();

  try {
    let jobs: any[] = [];

    // Strategy 1: Try to match by apply link domain if entity has a website
    if (entityWebsiteUrl) {
      try {
        const entityUrl = new URL(entityWebsiteUrl);
        const entityDomain = entityUrl.hostname.toLowerCase().replace('www.', '');
        
        // First try to find jobs where apply link contains the entity domain
        const domainJobs = await JobModel.find(
          {
            applyLink: { 
              $regex: new RegExp(entityDomain.replace(/\./g, '\\.'), 'i') 
            },
            plan: { $nin: ['pending'] }
          },
          {},
          { sort: { createdAt: -1 }, limit }
        );
        
        jobs = domainJobs;
        console.log(`Found ${jobs.length} jobs by domain matching for ${entityDomain}`);
      } catch (error) {
        console.log('Failed to parse entity website URL:', error);
      }
    }

    // Strategy 2: If we don't have enough jobs and have entity name, try company name matching
    if (jobs.length < limit && entityName) {
      const remainingLimit = limit - jobs.length;
      const existingJobIds = jobs.map(job => job._id.toString());
      
      const nameJobs = await JobModel.find(
        {
          _id: { $nin: existingJobIds },
          companyName: { $regex: new RegExp(entityName, 'i') },
          plan: { $nin: ['pending'] }
        },
        {},
        { sort: { createdAt: -1 }, limit: remainingLimit }
      );
      
      jobs = [...jobs, ...nameJobs];
      console.log(`Found ${nameJobs.length} additional jobs by name matching for ${entityName}`);
    }

    // Strategy 3: If still not enough jobs, get jobs with no source or any source
    if (jobs.length < limit) {
      const remainingLimit = limit - jobs.length;
      const existingJobIds = jobs.map(job => job._id.toString());
      
      // First try jobs with no source
      const noSourceJobs = await JobModel.find(
        {
          _id: { $nin: existingJobIds },
          $or: [
            { source: { $exists: false } },
            { source: null },
            { source: '' }
          ],
          plan: { $nin: ['pending'] }
        },
        {},
        { sort: { createdAt: -1 }, limit: remainingLimit }
      );
      
      jobs = [...jobs, ...noSourceJobs];
      console.log(`Found ${noSourceJobs.length} jobs with no source`);
      
      // If still not enough, get any jobs with source
      if (jobs.length < limit) {
        const finalRemainingLimit = limit - jobs.length;
        const finalExistingJobIds = jobs.map(job => job._id.toString());
        
        const anySourceJobs = await JobModel.find(
          {
            _id: { $nin: finalExistingJobIds },
            source: { $exists: true, $ne: null },
            plan: { $nin: ['pending'] }
          },
          {},
          { sort: { createdAt: -1 }, limit: finalRemainingLimit }
        );
        
        jobs = [...jobs, ...anySourceJobs];
        console.log(`Found ${anySourceJobs.length} jobs with any source`);
      }
    }

    return JSON.parse(JSON.stringify(jobs.slice(0, limit))); // Ensure we return exactly the limit
  } catch (error) {
    console.error('Error fetching jobs for entity:', error);
    return [];
  }
}
