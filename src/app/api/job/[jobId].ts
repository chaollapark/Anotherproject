// pages/api/job/[jobId].ts

import { NextApiRequest, NextApiResponse } from 'next';
import mongoose from "mongoose";
import { JobModel } from '@/models/Job';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { jobId } = req.query;

  await mongoose.connect(process.env.MONGO_URI as string);

  try {
    console.log('jobId', jobId);
    const job = await JobModel.findById(jobId as string).lean();
    console.log('job', job);
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    return res.status(200).json(job);
  } catch (error) {
    console.error('Error fetching job:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
