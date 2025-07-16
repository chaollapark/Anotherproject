const express = require('express');
const router = express.Router();
const jobService = require('../services/jobService');
const userService = require('../services/userService');

// Middleware to check admin access (you can enhance this with proper authentication)
const requireAdmin = (req, res, next) => {
  const adminKey = req.headers['x-admin-key'];
  if (adminKey !== process.env.ADMIN_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
};

// Add a new job
router.post('/jobs', requireAdmin, async (req, res) => {
  try {
    const { title, company, description, url, level, location, salary, featured } = req.body;
    
    if (!title || !company || !url || !level) {
      return res.status(400).json({ 
        error: 'Title, company, URL, and level are required' 
      });
    }

    const validLevels = ['junior', 'middle', 'senior'];
    if (!validLevels.includes(level)) {
      return res.status(400).json({ 
        error: 'Invalid level. Must be junior, middle, or senior' 
      });
    }

    const jobData = {
      title,
      company,
      description,
      url,
      level,
      location,
      salary,
      featured: featured || false
    };

    const jobId = await jobService.addJob(jobData);
    
    res.status(201).json({ 
      success: true, 
      message: 'Job added successfully',
      jobId 
    });
    
  } catch (error) {
    console.error('Error adding job:', error);
    res.status(500).json({ 
      error: 'Failed to add job' 
    });
  }
});

// Add multiple jobs
router.post('/jobs/bulk', requireAdmin, async (req, res) => {
  try {
    const { jobs } = req.body;
    
    if (!Array.isArray(jobs) || jobs.length === 0) {
      return res.status(400).json({ 
        error: 'Jobs array is required and must not be empty' 
      });
    }

    // Validate each job
    for (const job of jobs) {
      if (!job.title || !job.company || !job.url || !job.level) {
        return res.status(400).json({ 
          error: 'Each job must have title, company, URL, and level' 
        });
      }
    }

    const jobIds = await jobService.addJobs(jobs);
    
    res.status(201).json({ 
      success: true, 
      message: `${jobs.length} jobs added successfully`,
      jobIds 
    });
    
  } catch (error) {
    console.error('Error adding jobs:', error);
    res.status(500).json({ 
      error: 'Failed to add jobs' 
    });
  }
});

// Update a job
router.put('/jobs/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    // Remove fields that shouldn't be updated
    delete updateData._id;
    delete updateData.createdAt;
    
    const result = await jobService.updateJob(id, updateData);
    
    if (result.matchedCount === 0) {
      return res.status(404).json({ 
        error: 'Job not found' 
      });
    }
    
    res.json({ 
      success: true, 
      message: 'Job updated successfully' 
    });
    
  } catch (error) {
    console.error('Error updating job:', error);
    res.status(500).json({ 
      error: 'Failed to update job' 
    });
  }
});

// Delete a job
router.delete('/jobs/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await jobService.deleteJob(id);
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ 
        error: 'Job not found' 
      });
    }
    
    res.json({ 
      success: true, 
      message: 'Job deleted successfully' 
    });
    
  } catch (error) {
    console.error('Error deleting job:', error);
    res.status(500).json({ 
      error: 'Failed to delete job' 
    });
  }
});

// Get job statistics
router.get('/stats', requireAdmin, async (req, res) => {
  try {
    const [jobStats, userStats] = await Promise.all([
      jobService.getJobStats(),
      userService.getAllSubscribedUsers()
    ]);

    const totalUsers = userStats.length;
    const activeUsers = userStats.filter(user => user.subscribed).length;
    
    const levelBreakdown = userStats.reduce((acc, user) => {
      const level = user.preferences?.level || 'unknown';
      acc[level] = (acc[level] || 0) + 1;
      return acc;
    }, {});

    res.json({
      success: true,
      stats: {
        jobs: jobStats,
        users: {
          total: totalUsers,
          active: activeUsers,
          levelBreakdown
        }
      }
    });
    
  } catch (error) {
    console.error('Error getting stats:', error);
    res.status(500).json({ 
      error: 'Failed to get statistics' 
    });
  }
});

// Search jobs
router.get('/jobs/search', requireAdmin, async (req, res) => {
  try {
    const { q, level, featured } = req.query;
    
    if (!q) {
      return res.status(400).json({ 
        error: 'Search query is required' 
      });
    }

    const filters = {};
    if (level) filters.level = level;
    if (featured !== undefined) filters.featured = featured === 'true';

    const jobs = await jobService.searchJobs(q, filters);
    
    res.json({
      success: true,
      jobs,
      count: jobs.length
    });
    
  } catch (error) {
    console.error('Error searching jobs:', error);
    res.status(500).json({ 
      error: 'Failed to search jobs' 
    });
  }
});

module.exports = router; 