import { Suspense } from 'react';
import Link from 'next/link';
import dbConnect from '@/lib/dbConnect';
import { JobModel, getAllJobSlugs } from '@/models/Job';

const JOBS_PER_PAGE = 100;

function chunkArray(array: any[], size: number) {
  return Array.from({ length: Math.ceil(array.length / size) }, (_, index) =>
    array.slice(index * size, index * size + size)
  );
}

export async function generateStaticParams() {
  await dbConnect();
  const allSlugs = await getAllJobSlugs();
  const totalPages = Math.ceil(allSlugs.length / JOBS_PER_PAGE);
  
  return Array.from({ length: totalPages }, (_, i) => ({
    page: (i + 1).toString(),
  }));
}

export default async function AllJobsPage({ 
  searchParams 
}: { 
  searchParams?: { page?: string, q?: string } 
}) {
  await dbConnect();
  
  const currentPage = searchParams?.page ? parseInt(searchParams.page) : 1;
  const searchQuery = searchParams?.q || '';

  const query: any = {};
  if (searchQuery) {
    query.$or = [
      { title: { $regex: searchQuery, $options: 'i' } },
      { companyName: { $regex: searchQuery, $options: 'i' } },
      { description: { $regex: searchQuery, $options: 'i' } },
    ];
  }
  
  const jobs = await JobModel.find(
    query, 
    { title: 1, slug: 1, companyName: 1, createdAt: 1, seniority: 1 },
    { sort: '-createdAt' }
  ).lean();
  
  const totalPages = Math.ceil(jobs.length / JOBS_PER_PAGE);
  const jobsChunks = chunkArray(jobs, JOBS_PER_PAGE);
  const pageJobs = jobsChunks[currentPage - 1] || jobsChunks[0] || [];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">
        {searchQuery ? `Search results for "${searchQuery}"` : 'All Job Listings'}
      </h1>
      <p className="text-gray-600 mb-8">
        {searchQuery ? `${jobs.length} jobs found.` : `Browse through all available job listings.`} Page {currentPage} of {totalPages}.
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
      
      <div className="flex justify-center mt-6">
        <nav className="inline-flex rounded-md shadow">
          <ul className="flex">
            {Array.from({ length: totalPages }, (_, i) => (
              <li key={i + 1}>
                <Link
                  href={`/all-jobs?page=${i + 1}${searchQuery ? `&q=${searchQuery}`: ''}`}
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
