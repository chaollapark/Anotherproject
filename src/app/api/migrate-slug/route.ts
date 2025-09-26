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
    
    // Get all jobs (both with and without slugs to fix length issues)
    const jobs = await JobModel.find({});
    let updated = 0;
    let fixed = 0;

    for (const job of jobs) {
      const newSlug = generateSafeSlug(job.title, job.companyName, job._id.toString());
      
      // Update if no slug exists or if current slug is too long
      if (!job.slug || job.slug.length > 150) {
        await JobModel.findByIdAndUpdate(job._id, { slug: newSlug });
        if (!job.slug) {
          updated++;
        } else {
          fixed++;
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: `Updated ${updated} jobs with new slugs, fixed ${fixed} jobs with overly long slugs`,
      total: updated + fixed
    });
  } catch (error) {
    console.error('Error in migration:', error);
    return NextResponse.json({ error: 'Migration failed' }, { status: 500 });
  }
}
