import { Metadata } from "next";
import JobPageClient from "./JobPageClient";
import { findJobBySlug } from "@/models/Job";
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
 * Use Incremental Static Regeneration (ISR) instead of generateStaticParams
 * Pages will be generated on-demand when first visited, then cached
 * This prevents build timeouts while maintaining good performance
 */
export const revalidate = 3600; // Revalidate every hour

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