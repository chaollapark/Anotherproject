import dbConnect from '@/lib/dbConnect';
import Hero from "@/app/components/Hero";
import Jobs from "@/app/components/Jobs";
import JobFilterBar from "@/app/components/JobFilterBar";
import { fetchJobs } from "@/models/Job";
import { searchJobs } from "@/app/actions/jobActions";

export const revalidate = 60; // revalidate this page every 60 seconds

export default async function Home({
  searchParams
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  await dbConnect();
  
  const searchPhrase = typeof searchParams.search === 'string' ? searchParams.search : '';
  
  const jobs = searchPhrase
    ? await searchJobs(searchPhrase)
    : await fetchJobs(10);
  const header = searchPhrase ? `Search Results for "${searchPhrase}"` : "Latest Jobs";

  return (
    <div className="relative">
      {/* Grid Background */}
      <div className="grid-background"></div>

      {/* Page Content */}
      <Hero />
      <JobFilterBar />
      <Jobs header={header} initialJobs={jobs} isSearchResult={!!searchPhrase} />
    </div>
  );
}
