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
      
      {/* Seniority Filter Navigation */}
      <div className="bg-blue-50 rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4 text-center">Filter by Experience Level</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link 
            href="/internships" 
            className="bg-white hover:bg-blue-100 border-2 border-blue-200 hover:border-blue-300 rounded-lg p-4 text-center transition-all duration-200 group"
          >
            <div className="text-2xl mb-2">🎓</div>
            <div className="font-semibold text-blue-800 group-hover:text-blue-900">Internships</div>
            <div className="text-sm text-gray-600">Entry-level opportunities</div>
          </Link>
          
          <Link 
            href="/junior-positions" 
            className="bg-white hover:bg-green-100 border-2 border-green-200 hover:border-green-300 rounded-lg p-4 text-center transition-all duration-200 group"
          >
            <div className="text-2xl mb-2">🌱</div>
            <div className="font-semibold text-green-800 group-hover:text-green-900">Junior Positions</div>
            <div className="text-sm text-gray-600">0-2 years experience</div>
          </Link>
          
          <Link 
            href="/mid-level-positions" 
            className="bg-white hover:bg-orange-100 border-2 border-orange-200 hover:border-orange-300 rounded-lg p-4 text-center transition-all duration-200 group"
          >
            <div className="text-2xl mb-2">⚡</div>
            <div className="font-semibold text-orange-800 group-hover:text-orange-900">Mid-Level</div>
            <div className="text-sm text-gray-600">3-5 years experience</div>
          </Link>
          
          <Link 
            href="/senior-positions" 
            className="bg-white hover:bg-purple-100 border-2 border-purple-200 hover:border-purple-300 rounded-lg p-4 text-center transition-all duration-200 group"
          >
            <div className="text-2xl mb-2">👑</div>
            <div className="font-semibold text-purple-800 group-hover:text-purple-900">Senior Positions</div>
            <div className="text-sm text-gray-600">5+ years experience</div>
          </Link>
        </div>
      </div>
      
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
      
      {/* Smart Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <nav className="inline-flex rounded-md shadow">
            <div className="flex">
              {/* Previous Button */}
              {currentPage > 1 && (
                <Link
                  href={`/all-jobs?page=${currentPage - 1}`}
                  className="px-3 py-2 border border-r-0 bg-white text-gray-700 hover:bg-gray-50 rounded-l-md"
                >
                  ← Previous
                </Link>
              )}
              
              {/* First page */}
              {currentPage > 3 && (
                <>
                  <Link
                    href="/all-jobs?page=1"
                    className="px-4 py-2 border border-r-0 bg-white text-gray-700 hover:bg-gray-50"
                  >
                    1
                  </Link>
                  {currentPage > 4 && (
                    <span className="px-4 py-2 border border-r-0 bg-white text-gray-500">...</span>
                  )}
                </>
              )}
              
              {/* Pages around current page */}
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                
                if (pageNum < 1 || pageNum > totalPages) return null;
                if (currentPage > 3 && pageNum === 1) return null;
                if (currentPage < totalPages - 2 && pageNum === totalPages) return null;
                
                return (
                  <Link
                    key={pageNum}
                    href={`/all-jobs?page=${pageNum}`}
                    className={`px-4 py-2 border border-r-0 ${
                      currentPage === pageNum
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {pageNum}
                  </Link>
                );
              })}
              
              {/* Last page */}
              {currentPage < totalPages - 2 && (
                <>
                  {currentPage < totalPages - 3 && (
                    <span className="px-4 py-2 border border-r-0 bg-white text-gray-500">...</span>
                  )}
                  <Link
                    href={`/all-jobs?page=${totalPages}`}
                    className="px-4 py-2 border border-r-0 bg-white text-gray-700 hover:bg-gray-50"
                  >
                    {totalPages}
                  </Link>
                </>
              )}
              
              {/* Next Button */}
              {currentPage < totalPages && (
                <Link
                  href={`/all-jobs?page=${currentPage + 1}`}
                  className="px-3 py-2 border bg-white text-gray-700 hover:bg-gray-50 rounded-r-md"
                >
                  Next →
                </Link>
              )}
            </div>
          </nav>
        </div>
      )}
    </div>
  );
}
