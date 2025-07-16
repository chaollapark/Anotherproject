const connectDB = require('../utils/db');

class JobService {
  async getJobsForUser(level, limit = 5) {
    const db = await connectDB();
    
    return await db.collection('jobs')
      .find({ level })
      .sort({ datePosted: -1 })
      .limit(limit)
      .toArray();
  }

  async getFeaturedJobs(limit = 3) {
    const db = await connectDB();
    
    return await db.collection('jobs')
      .find({ featured: true })
      .sort({ datePosted: -1 })
      .limit(limit)
      .toArray();
  }

  async addJob(jobData) {
    const db = await connectDB();
    
    const job = {
      ...jobData,
      createdAt: new Date(),
      datePosted: jobData.datePosted || new Date()
    };

    const result = await db.collection('jobs').insertOne(job);
    console.log(`Job added: ${jobData.title} at ${jobData.company}`);
    return result.insertedId;
  }

  async addJobs(jobsArray) {
    const db = await connectDB();
    
    const jobs = jobsArray.map(job => ({
      ...job,
      createdAt: new Date(),
      datePosted: job.datePosted || new Date()
    }));

    const result = await db.collection('jobs').insertMany(jobs);
    console.log(`${jobs.length} jobs added`);
    return result.insertedIds;
  }

  async updateJob(jobId, updateData) {
    const db = await connectDB();
    
    return await db.collection('jobs').updateOne(
      { _id: jobId },
      { 
        $set: {
          ...updateData,
          updatedAt: new Date()
        }
      }
    );
  }

  async deleteJob(jobId) {
    const db = await connectDB();
    
    return await db.collection('jobs').deleteOne({ _id: jobId });
  }

  async getJobStats() {
    const db = await connectDB();
    
    const stats = await db.collection('jobs').aggregate([
      {
        $group: {
          _id: '$level',
          count: { $sum: 1 },
          featured: {
            $sum: { $cond: ['$featured', 1, 0] }
          }
        }
      }
    ]).toArray();

    return stats;
  }

  async searchJobs(query, filters = {}) {
    const db = await connectDB();
    
    const searchQuery = {
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { company: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } }
      ],
      ...filters
    };

    return await db.collection('jobs')
      .find(searchQuery)
      .sort({ datePosted: -1 })
      .toArray();
  }
}

module.exports = new JobService(); 