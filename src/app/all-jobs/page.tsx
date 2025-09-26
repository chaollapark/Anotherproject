import { Suspense } from 'react';
import Link from 'next/link';
import dbConnect from '@/lib/dbConnect';
import { JobModel } from '@/models/Job';

// Define how many jobs to show per page
const JOBS_PER_PAGE = 100;

// Helper function to chunk the jobs into pages
function chunkArray(array: any[], size: number) {
  return Array.from({ length: Math.ceil(array.length / size) }, (_, index) =>
    array.slice(index * size, index * size + size)
  );
}

/** 
 * Use Incremental Static Regeneration (ISR) for all-jobs page
 * This prevents build timeouts from database connections
 */
export const revalidate = 3600; // Revalidate every hour

// This is our main page component for /all-jobs
export default async function AllJobsPage({ 
  searchParams 
}: { 
  searchParams?: { page?: string } 
}) {
  await dbConnect();
  
  // Get the current page from the URL or default to 1
  const currentPage = searchParams?.page ? parseInt(searchParams.page) : 1;
  
  // Fetch all jobs with essential fields only (title, slug, company)
  const jobs = await JobModel.find(
    {}, 
    { title: 1, slug: 1, companyName: 1, createdAt: 1, seniority: 1 },
    { sort: '-createdAt' }
  ).lean();
  
  // Calculate total pages
  const totalPages = Math.ceil(jobs.length / JOBS_PER_PAGE);
  
  // Chunk the jobs into pages
  const jobsChunks = chunkArray(jobs, JOBS_PER_PAGE);
  
  // Get the jobs for the current page (or first page if current page is out of bounds)
  const pageJobs = jobsChunks[currentPage - 1] || jobsChunks[0];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">All Job Listings</h1>
      <p className="text-gray-600 mb-8">
        Browse through all available job listings. Page {currentPage} of {totalPages}.
      </p>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <Suspense fallback={<div>Loading job listings...</div>}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pageJobs.map((job: any) => (
              <div key={job._id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <Link href={`/jobs/${job.slug}`} className="block">
                  <h2 className="text-lg font-semibold text-blue-600 hover:underline">{job.title}</h2>
                  <p className="text-gray-600">{job.companyName}</p>
                  {job.seniority && (
                    <p className="text-sm text-gray-500 capitalize">
                      {job.seniority} • Posted {new Date(job.createdAt).toLocaleDateString()}
                    </p>
                  )}
                </Link>
              </div>
            ))}
          </div>
        </Suspense>
      </div>
      
      {/* Pagination */}
      <div className="flex justify-center mt-6">
        <nav className="inline-flex rounded-md shadow">
          <ul className="flex">
            {Array.from({ length: totalPages }, (_, i) => (
              <li key={i + 1}>
                <Link
                  href={`/all-jobs?page=${i + 1}`}
                  className={`px-4 py-2 border ${
                    currentPage === i + 1
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {i + 1}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
}
