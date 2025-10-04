import { MetadataRoute } from 'next';
import dbConnect from '@/lib/dbConnect';
import LobbyingEntityModel from '@/models/LobbyingEntity';
import { JobModel } from '@/models/Job'; // Make sure this path and export are correct

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  await dbConnect();

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (!siteUrl) {
    console.warn("Missing NEXT_PUBLIC_SITE_URL for sitemap. Using relative paths as fallback, but absolute URLs are recommended for production.");
  }
  const baseUrl = siteUrl || '';

  // 1. Lobbying Entities
  const lobbyingEntities = await LobbyingEntityModel.find({}, 'slug updatedAt').lean();
  const lobbyingEntityEntries: MetadataRoute.Sitemap = lobbyingEntities.map(entity => ({
    url: `${baseUrl}/lobbying-entities/${entity.slug}`,
    lastModified: entity.updatedAt ? new Date(entity.updatedAt) : new Date(),
    changeFrequency: 'yearly',
    priority: 0.8,
  }));

  // 2. Job Listings
  const jobs = await JobModel.find({}, 'slug status updatedAt').lean();
  const jobEntries: MetadataRoute.Sitemap = jobs.map((job: any) => { // Added 'any' for job type, refine if you have a specific lean type
    let priority = 0.7;
    let changefreq: 'monthly' | 'yearly' | 'never' = 'monthly';

    if (job.status === 'expired') {
      priority = 0.3;
      changefreq = 'never';
    } else if (job.updatedAt && new Date(job.updatedAt) < new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)) {
      priority = 0.5;
      // changefreq remains 'daily' or could be 'weekly'
    }
    return {
      url: `${baseUrl}/jobs/${job.slug}`,
      lastModified: job.updatedAt ? new Date(job.updatedAt) : new Date(),
      changeFrequency: changefreq,
      priority: priority,
    };
  });

  // 3. Static Pages (Consolidated and de-duplicated)
  // Ensure all URLs are absolute or correctly prefixed with baseUrl
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl || '/', // Ensures a valid URL even if baseUrl is empty
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/lobbying-entities`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/all-jobs`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.7, // This was in the new sitemap
    },
    // Seniority-based job filter pages
    {
      url: `${baseUrl}/internships`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/junior-positions`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/mid-level-positions`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/senior-positions`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    // Assuming /jobs is the main listing page for jobs, if different from /all-jobs
    // If /all-jobs is the main one, you might not need a separate /jobs entry or adjust priorities.
    {
      url: `${baseUrl}/jobs`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9, 
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'monthly', // Aligned to 'daily' as it's often more frequent
      priority: 1.0, // Kept higher priority from API route version
    },
    {
      url: `${baseUrl}/fairpay`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    // Add other important static pages like /contact, /about, /new-listing/form etc.
    // Example:
    // { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.5 },
  ];

  return [
    ...staticPages,
    ...lobbyingEntityEntries,
    ...jobEntries,
  ];
}
