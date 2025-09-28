import { NextResponse } from 'next/server';
import { JobModel } from '@/models/Job';
import dbConnect from '@/lib/dbConnect';

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

export async function GET() {
  try {
    await dbConnect();
    
    // Process jobs in smaller batches to prevent timeouts
    const BATCH_SIZE = 50; // Smaller batches for better performance
    let totalUpdated = 0;
    let totalFixed = 0;
    let skip = 0;
    
    while (true) {
      // Get jobs in batches with only necessary fields
      const jobs = await JobModel.find({}, 'title companyName slug')
        .skip(skip)
        .limit(BATCH_SIZE)
        .lean(); // Use lean for better performance
      
      if (jobs.length === 0) break;
      
      const bulkOps = [];
      
      for (const job of jobs) {
        const newSlug = generateSafeSlug(job.title, job.companyName, String(job._id));
        
        // Update if no slug exists or if current slug is too long
        if (!job.slug || job.slug.length > 150) {
          bulkOps.push({
            updateOne: {
              filter: { _id: job._id },
              update: { slug: newSlug }
            }
          });
          
          if (!job.slug) {
            totalUpdated++;
          } else {
            totalFixed++;
          }
        }
      }
      
      // Bulk update for better performance
      if (bulkOps.length > 0) {
        await JobModel.bulkWrite(bulkOps);
      }
      
      skip += BATCH_SIZE;
      
      // Safety check to prevent infinite loops
      if (skip > 10000) {
        console.log('Migration stopped at 10,000 jobs for safety');
        break;
      }
    }

    return NextResponse.json({
      success: true,
      message: `Updated ${totalUpdated} jobs with new slugs, fixed ${totalFixed} jobs with overly long slugs`,
      total: totalUpdated + totalFixed
    });
  } catch (error) {
    console.error('Error in migration:', error);
    return NextResponse.json({ error: 'Migration failed' }, { status: 500 });
  }
}

// Prevent static generation of this API route
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
