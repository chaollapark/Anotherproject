import { Metadata } from "next";
import JobPageClient from "./JobPageClient";
import { getAllJobSlugs, findJobBySlug } from "@/models/Job";
import { notFound } from "next/navigation";

type Params = { id: string };

/** Self-referencing canonical for each job page */
export async function generateMetadata(
  { params }: { params: Params }
): Promise<Metadata> {
  return {
    alternates: {
      canonical: `/jobs/${params.id}`,               // → https://www.eujobs.co/jobs/…
    },
  };
}

/** 
 * Generate static pages for a limited number of job slugs at build time
 * This prevents memory issues while still pre-rendering the most important pages
 * The rest will be generated on-demand (ISR)
 */
export async function generateStaticParams() {
  const slugs = await getAllJobSlugs();
  // Filter out slugs that would cause filesystem path issues (over 100 chars)
  const validSlugs = slugs.filter(slug => slug && slug.length <= 100);
  
  // Limit to first 1000 jobs to prevent memory issues during build
  // The rest will be generated on-demand using ISR
  const limitedSlugs = validSlugs.slice(0, 1000);
  
  console.log(`Static generation: ${limitedSlugs.length} of ${validSlugs.length} valid slugs (filtered ${slugs.length - validSlugs.length} overly long slugs)`);
  return limitedSlugs.map(slug => ({ id: slug }));
}

/** 
 * Renders the job page or returns 404 for invalid slugs
 * This prevents orphan pages by ensuring only valid job pages are accessible
 * Uses ISR for pages not pre-generated at build time
 */
export default async function JobPage({ params }: { params: Params }) {
  // Check if job exists, return 404 if not found
  const job = await findJobBySlug(params.id);
  if (!job) {
    notFound();
  }
  
  return <JobPageClient params={params} />;
}

// Enable ISR with 1 hour revalidation for job pages not pre-generated
export const revalidate = 3600;