// app/page.tsx

import dbConnect from '@/lib/dbConnect';
import Hero from '@/app/components/Hero';
import { fetchJobs } from '@/models/Job';
import { searchJobs } from '@/app/actions/jobActions';
import JobWithDetails from '@/app/components/JobWithDetails';

export const revalidate = 60; // Revalidate this page every 60 seconds

export default async function Home({ searchParams }) {
  await dbConnect();

  const searchPhrase = typeof searchParams.search === 'string' ? searchParams.search : '';

  const jobs = searchPhrase ? await searchJobs(searchPhrase) : await fetchJobs(10);

  const header = searchPhrase ? `Search Results for "${searchPhrase}"` : 'Latest Jobs';

  return (
    <>
      <Hero />
      <JobWithDetails jobs={jobs} header={header} isSearchResult={!!searchPhrase} />
    </>
  );
}
