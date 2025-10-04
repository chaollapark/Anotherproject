import dbConnect from '@/lib/dbConnect';
import Hero from "@/app/components/Hero";
import Jobs from "@/app/components/Jobs";
import JobFilterBar from "@/app/components/JobFilterBar"; // ✅ import
import { fetchJobsBySource, fetchJobs, fetchJobsBySeniority } from "@/models/Job";
import { notFound } from "next/navigation";

const FILTER_MAP: Record<string, string> = {
  "best-jobs": "",
  "eu-institutions-jobs": "eu-institution",
  "eu-agencies-jobs": "eu-rss",
  "eurobrussels-jobs": "eurobrussels",
  "jobs-in-Brussels": "jobsin",
  "euractiv-jobs": "euractiv", // 😎
  "internships": "intern",
  "junior-positions": "junior",
  "mid-level-positions": "mid-level",
  "senior-positions": "senior",
};

export const revalidate = 60;

// Generate static pages for all valid filters at build time
// Keep static generation for filters since there are only a few filter pages
export function generateStaticParams() {
  return Object.keys(FILTER_MAP).map(filter => ({ filter }));
}

export default async function FilteredPage({ params }: { params: { filter: string } }) {
  await dbConnect();

  const filterValue = FILTER_MAP[params.filter];
  
  // Return 404 for invalid filters
  if (params.filter && !FILTER_MAP.hasOwnProperty(params.filter)) {
    notFound();
  }
  
  // Check if this is a seniority filter
  const seniorityFilters = ["internships", "junior-positions", "mid-level-positions", "senior-positions"];
  const isSeniorityFilter = seniorityFilters.includes(params.filter);
  
  let jobs;
  let header;
  
  if (isSeniorityFilter) {
    jobs = await fetchJobsBySeniority(filterValue);
    const seniorityLabels: Record<string, string> = {
      "internships": "Internship Opportunities",
      "junior-positions": "Junior Level Positions", 
      "mid-level-positions": "Mid-Level Positions",
      "senior-positions": "Senior Level Positions"
    };
    header = seniorityLabels[params.filter];
  } else {
    jobs = filterValue ? await fetchJobsBySource(filterValue) : await fetchJobs(10);
    header = filterValue ? `Jobs from ${params.filter.replace(/-/g, ' ')}` : 'Latest Jobs';
  }

  return (
    <div className="relative">
      <div className="grid-background" />
      <Hero />
      <JobFilterBar /> {/* ✅ Now also on filtered pages */}
      <Jobs header={header} initialJobs={jobs} isSearchResult={!!filterValue} />
    </div>
  );
}
