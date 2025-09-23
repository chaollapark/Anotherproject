'use server';
import { JobModel, Job } from '@/models/Job';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import dbConnect from '@/lib/dbConnect';

const JobSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "Job title is required"),
  seniority: z.enum(["intern", "junior", "mid-level", "senior"], {
    errorMap: () => ({ message: "Please select a valid seniority level" }),
  }),
  companyName: z.string().min(1, "Company name is required"),
  type: z.enum(["project", "part", "full"]),
  description: z
    .string()
    .min(1, "Job description is required")
    .max(15000, "Description cannot exceed 15000 characters"),
  contactEmail: z.string().email("A valid email address is required"),
  salary: z.string().optional(),
  country: z.string().optional(),
  state: z.string().optional(),
  city: z.string().optional(),
  countryId: z.string().optional(),
  stateId: z.string().optional(),
  cityId: z.string().optional(),
  jobIcon: z.string().optional(),
  contactName: z.string().optional(),
  contactPhone: z.string().optional(),
  postalCode: z.string().optional(),
  street: z.string().optional(),
  expiresOn: z.string().optional(),
  plan: z.string().optional().default("pending"),
  applyLink: z
    .string()
    .optional(),
  blockAIApplications: z.boolean().optional().default(true),
});

export async function updateJobStatusAfterPayment(jobId: string, plan: string): Promise<Job> {
  try {
    await dbConnect();
    // Skip payment status update for the Basic plan
    if (plan === 'basic') {
      const job = await JobModel.findById(jobId);

      if (!job) {
        throw new Error('Job not found');
      }

      // Ensure the job's plan is updated to 'basic'
      job.plan = 'basic';
      await job.save();

      revalidatePath('/jobs');
      return job.toObject();
    }

    const job = await JobModel.findByIdAndUpdate(jobId, { plan: plan }, { new: true });

    if (!job) {
      throw new Error('Job not found');
    }

    revalidatePath('/jobs');
    return job.toObject();
  } catch (error) {
    console.error('Error updating job status:', error);
    throw new Error('Failed to update job status');
  }
}

export async function saveJobAction(formData: FormData): Promise<Job> {
  try {
    await dbConnect();
    console.log("we have entered the save job action function you get me.");

    // Convert FormData to an object
    const jobData = Object.fromEntries(formData) as Record<string, any>;
    
    console.log('Raw jobData from FormData:', jobData);
    
    // Convert string boolean values to actual booleans
    if (jobData.blockAIApplications !== undefined) {
      console.log('Converting blockAIApplications from string to boolean:', jobData.blockAIApplications);
      jobData.blockAIApplications = jobData.blockAIApplications === 'true';
      console.log('Converted blockAIApplications:', jobData.blockAIApplications);
    }

    // No authentication - proceed without user checks
    const validatedData = JobSchema.parse(jobData);
    console.log("Validated data after schema parsing:", validatedData);

    let job;
    if (validatedData.id) {
      // Update existing job without ownership checks
      job = await JobModel.findByIdAndUpdate(validatedData.id, validatedData, { new: true });
    } else {
      job = await JobModel.create(validatedData);
    }

    if (!job) {
      throw new Error('Failed to save job');
    }

    revalidatePath('/jobs');
    return job.toObject();
  } catch (error) {
    console.error('Error saving job:', error);
    if (error instanceof z.ZodError) {
      const errorMessages = error.errors.map(err => err.message).join(", ");
      throw new Error(`Validation failed: ${errorMessages}`);
    }
    throw new Error('Failed to save job');
  }
}

export async function getMyJobs(): Promise<Job[]> {
  try {
    await dbConnect();
    // No authentication - return all jobs or handle differently based on your needs
    const jobs = await JobModel.find({});
    return jobs.map(job => job.toObject());
  } catch (error) {
    console.error('Error retrieving jobs:', error);
    throw new Error('Failed to retrieve jobs');
  }
}

export async function searchJobs(searchPhrase: string, limit: number = 10): Promise<Job[]> {
  try {
    await dbConnect();

    const searchRegex = new RegExp(searchPhrase, 'i');

    const jobs = await JobModel.find(
      {
        $or: [
          { title: searchRegex },
          { description: searchRegex },
          { companyName: searchRegex },
        ]
      },
      {},
      { sort: '-createdAt', limit }
    );

    return JSON.parse(JSON.stringify(jobs));
  } catch (error) {
    console.error('Error searching jobs:', error);
    return [];
  }
}
