"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaPlus } from 'react-icons/fa'; // Using react-icons for a plus icon
import posthog from "posthog-js";

export default function FloatingPostJobButton() {
  const pathname = usePathname();

  const handlePostJobClick = () => {
    posthog.capture('post_a_job_click');
  };

  if (pathname === '/new-listing/form') {
    return null; // Don't render the button on the form page
  }

  return (
    <div className="hidden md:block fixed top-1/2 right-8 -translate-y-1/2 z-50">
      <Link
        href="/new-listing/form"
        className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition-all duration-300 ease-in-out flex flex-col items-center text-center transform hover:scale-105"
        onClick={handlePostJobClick}
      >
        <div className="flex items-center">
          <FaPlus className="mr-2 h-5 w-5" />
          <span>Post a Job</span>
        </div>
        <span className="text-xs mt-1 font-normal">With EUjobs it's only 99.99 euros</span>
      </Link>
    </div>
  );
}
