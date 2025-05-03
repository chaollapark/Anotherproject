import Link from 'next/link';
import { getSortedPostsData } from '@/lib/blogUtils';
import { fetchJobs } from "@/models/Job";
import dbConnect from '@/lib/dbConnect';
import { Job } from "@/models/Job";

export default async function BlogIndex() {
  await dbConnect();
  
  // Fetch blog posts
  const allPostsData = getSortedPostsData();
  
  // Fetch 6 jobs to display at the top of the blog page
  const jobs = await fetchJobs(6);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Featured Jobs</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {jobs.map((job: Job) => (
          <div key={job._id} className="border rounded-lg p-4">
            <h2 className="text-lg font-semibold">{job.title}</h2>
            <p className="text-gray-600">{job.companyName}</p>
            <p className="mb-2 text-sm text-gray-500">{job.seniority}</p>
            <Link 
              href={`/jobs/${job.slug}`} 
              className="inline-block text-blue-600 hover:underline"
            >
              View Details
            </Link>
          </div>
        ))}
      </div>

      <h2 className="text-3xl font-bold mb-6">Blog Posts</h2>
      <ul className="space-y-4">
        {allPostsData.map(({ id, date, title }) => (
          <li key={id} className="border-b pb-4">
            <Link href={`/blog/${id}`} className="text-xl font-semibold hover:underline">
              {title}
            </Link>
            <br />
            <small className="text-gray-500">{date}</small>
          </li>
        ))}
      </ul>
    </div>
  );
}
