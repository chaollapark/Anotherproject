'use server';

import { redirect } from 'next/navigation';
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";

export default async function NewListingPage() {
  // Authentication removed - allow access to job posting

  async function createNewListing() {
    'use server';
    // Here you would typically create a new job listing
    // For now, we'll just redirect to the job form page
    redirect('/new-listing/form');
  }

  return (
    <div className="container">
      <div>
        <h2 className="text-lg mt-6">Create a New Job Listing</h2>
        <p className="text-gray-500 text-sm mb-2">Click below to create a new job listing</p>
        <div>
          <form action={createNewListing}>
            <button
              type="submit"
              className="inline-flex gap-2 items-center bg-indigo-500 text-white px-4 py-2 rounded-md mt-6 hover:bg-indigo-600 transition-colors"
            >
              Create a new job listing
              <FontAwesomeIcon className="h-4" icon={faArrowRight} />
            </button>
          </form>
        </div>
        <Link
          className="inline-flex gap-2 items-center bg-gray-200 px-4 py-2 rounded-md mt-6 hover:bg-gray-300 transition-colors"
          href={'/job-listings'}
        >
          View your job listings
          <FontAwesomeIcon className="h-4" icon={faArrowRight} />
        </Link>
      </div>
    </div>
  );
}
