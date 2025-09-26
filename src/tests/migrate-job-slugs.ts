/**
 * Migration script to fix overly long job slugs that cause ENAMETOOLONG errors
 * Run with: pnpm tsx src/tests/migrate-job-slugs.ts
 */

// Load environment variables
import { config } from 'dotenv';
config();

import { JobModel } from '../models/Job';
import dbConnect from '../lib/dbConnect';

// Safe slug generation function with length limits
function generateSafeSlug(title: string | null | undefined, companyName: string | null | undefined, id: string): string {
  const processString = (str: string | null | undefined, maxLength: number = 50) =>
    (str || '')
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
      .substring(0, maxLength)
      .replace(/-+$/, ''); // Remove trailing dashes

  const titleSlug = processString(title, 50) || 'untitled';
  const companySlug = processString(companyName, 50) || 'unknown-company';
  const shortId = id.slice(-6);

  const fullSlug = `${titleSlug}-at-${companySlug}-${shortId}`;
  
  // Ensure total slug length doesn't exceed filesystem limits (usually 255 chars)
  // We'll keep it under 150 to be safe for URL purposes as well
  return fullSlug.length > 150 ? fullSlug.substring(0, 150).replace(/-+$/, '') : fullSlug;
}

async function migrateJobSlugs() {
  console.log('🔧 Starting job slug migration...');
  
  try {
    await dbConnect();
    console.log('✅ Connected to database');
    
    // Get all jobs
    const jobs = await JobModel.find({});
    console.log(`📊 Found ${jobs.length} total jobs`);
    
    let updated = 0;
    let fixed = 0;
    let problematicJobs = [];

    for (const job of jobs) {
      const currentSlug = job.slug;
      const newSlug = generateSafeSlug(job.title, job.companyName, job._id.toString());
      
      // Log problematic slugs for debugging
      if (currentSlug && currentSlug.length > 150) {
        problematicJobs.push({
          id: job._id.toString(),
          title: job.title?.substring(0, 50) + '...',
          company: job.companyName?.substring(0, 50) + '...',
          oldSlugLength: currentSlug.length,
          newSlugLength: newSlug.length
        });
      }
      
      // Update if no slug exists or if current slug is too long
      if (!job.slug || job.slug.length > 150) {
        await JobModel.findByIdAndUpdate(job._id, { slug: newSlug });
        if (!job.slug) {
          updated++;
        } else {
          fixed++;
        }
        
        if ((updated + fixed) % 100 === 0) {
          console.log(`⏳ Processed ${updated + fixed} jobs...`);
        }
      }
    }

    console.log('\n📈 Migration Results:');
    console.log(`✅ Jobs with new slugs: ${updated}`);
    console.log(`🔧 Jobs with fixed overly long slugs: ${fixed}`);
    console.log(`📊 Total jobs processed: ${updated + fixed}`);
    
    if (problematicJobs.length > 0) {
      console.log(`\n🚨 Fixed ${problematicJobs.length} problematic slugs:`);
      problematicJobs.slice(0, 10).forEach(job => {
        console.log(`  - ${job.title} at ${job.company} (${job.oldSlugLength} → ${job.newSlugLength} chars)`);
      });
      if (problematicJobs.length > 10) {
        console.log(`  ... and ${problematicJobs.length - 10} more`);
      }
    }
    
    console.log('\n🎉 Migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

// Run the migration
migrateJobSlugs();
