import dbConnect from '@/lib/dbConnect';
import Hero from "@/app/components/Hero";
import Jobs from "@/app/components/Jobs";
import JobFilterBar from "@/app/components/JobFilterBar"; // ✅ import
import { fetchJobsBySource, fetchJobs } from "@/models/Job";
import { notFound } from "next/navigation";

const FILTER_MAP: Record<string, string> = {
  "best-jobs": "",
  "eu-institutions-jobs": "eu-institution",
  "eu-agencies-jobs": "eu-rss",
  "eurobrussels-jobs": "eurobrussels",
  "jobs-in-Brussels": "jobsin",
  "euractiv-jobs": "euractiv", // 😎
};

export const revalidate = 60;

// Generate static pages for all valid filters at build time
export function generateStaticParams() {
  return Object.keys(FILTER_MAP).map(filter => ({ filter }));
}

export default async function FilteredPage({ params }: { params: { filter: string } }) {
  await dbConnect();

  const source = FILTER_MAP[params.filter];
  
  // Return 404 for invalid filters
  if (params.filter && !FILTER_MAP.hasOwnProperty(params.filter)) {
    notFound();
  }
  
  const jobs = source ? await fetchJobsBySource(source) : await fetchJobs(10);
  const header = source ? `Jobs from ${params.filter.replace(/-/g, ' ')}` : 'Latest Jobs';

  return (
    <div className="relative">
      <div className="grid-background" />
      <Hero />
      <JobFilterBar /> {/* ✅ Now also on filtered pages */}
      <Jobs header={header} initialJobs={jobs} isSearchResult={!!source} />
    </div>
  );
}
