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
 * Generate static pages for all job slugs at build time
 * This ensures all job detail pages are pre-rendered as static HTML
 * Filters out slugs that are too long to prevent filesystem path issues
 */
export async function generateStaticParams() {
  const slugs = await getAllJobSlugs();
  // Filter out slugs that would cause filesystem path issues (over 100 chars)
  const validSlugs = slugs.filter(slug => slug && slug.length <= 100);
  console.log(`Filtered ${slugs.length - validSlugs.length} overly long slugs from static generation`);
  return validSlugs.map(slug => ({ id: slug }));
}

/** 
 * Renders the job page or returns 404 for invalid slugs
 * This prevents orphan pages by ensuring only valid job pages are accessible
 */
export default async function JobPage({ params }: { params: Params }) {
  // Check if job exists, return 404 if not found
  const job = await findJobBySlug(params.id);
  if (!job) {
    notFound();
  }
  
  return <JobPageClient params={params} />;
}