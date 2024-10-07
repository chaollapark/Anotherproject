'use server';

import { redirect } from 'next/navigation';
import Link from "next/link";
import { getUser } from "@workos-inc/authkit-nextjs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";

export default async function NewListingPage() {
  const { user } = await getUser();

  if (!user) {
    return (
      <div className="container">
        <div>You need to be logged in to post a job</div>
      </div>
    );
  }

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
              className="inline-flex gap-2 items-center bg-blue-500 text-white px-4 py-2 rounded-md mt-6 hover:bg-blue-600 transition-colors"
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
