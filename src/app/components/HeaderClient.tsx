"use client";
import Link from "next/link";
import { useState } from "react";
import posthog from "posthog-js";

interface HeaderClientProps {
  isAuthDisabled: boolean;
  user: any;
  signInUrl: string;
  isJobPoster: boolean;
}

export default function HeaderClient({
  isAuthDisabled,
  user,
  signInUrl,
  isJobPoster,
}: HeaderClientProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const handlePostJobClick = () => {
    posthog.capture('post_a_job_click');
    setMenuOpen(false);
  };

  return (
    <>
      {/* Hamburger button */}
      <button
        className="md:hidden text-gray-700 focus:outline-none z-50 relative"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
          />
        </svg>
      </button>

      {/* Mobile menu overlay */}
      <div
        className={`fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-90 z-40 transform ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 md:hidden`}
      >
        <div className="flex flex-col items-center justify-center h-full gap-6">
          {/* {!isAuthDisabled && !user && (
            <Link
              className="text-lg text-white transition-colors hover:bg-gray-700 rounded-md bg-gray-600 py-2 px-6"
              href={signInUrl}
              onClick={() => setMenuOpen(false)}
            >
              Login
            </Link>
          )} */}

          {!isAuthDisabled && user && (
            <form
              action="/api/auth/logout"
              method="POST"
              className="w-full text-center"
            >
              <button
                type="submit"
                className="text-lg text-white transition-colors hover:bg-gray-700 rounded-md bg-gray-600 py-2 px-6"
                onClick={() => setMenuOpen(false)}
              >
                Logout
              </button>
            </form>
          )}

          <Link
            className="text-lg text-white rounded-md py-2 px-6 bg-purple-500 hover:bg-purple-600 transition-colors mr-4 inline-flex items-center justify-center"
            href="/new-listing/form"
            onClick={() => setMenuOpen(false)}
          >
            Post a Job
          </Link>

          <Link
            className="text-lg text-white rounded-md py-2 px-6 bg-blue-600 hover:bg-blue-700 transition-colors inline-flex items-center justify-center"
            href="/headhunter"
            onClick={() => setMenuOpen(false)}
          >
            Headhunter
          </Link>


          {!isAuthDisabled && isJobPoster && user && (
            <Link
              className="text-lg text-white rounded-md py-2 px-6 bg-gray-600 hover:bg-gray-700 transition-colors"
              href="/dashboard"
              onClick={() => setMenuOpen(false)}
            >
              Dashboard
            </Link>
          )}

          <button
            className="text-white text-sm underline mt-4"
            onClick={() => setMenuOpen(false)}
          >
            Close Menu
          </button>
        </div>
      </div>

      {/* Desktop menu */}
      <nav className="hidden md:flex md:flex-wrap gap-4">
        {/* {!isAuthDisabled && !user && (
          <Link
            className="text-sm sm:text-base transition-colors hover:bg-gray-300 rounded-md bg-gray-200 py-2 px-4 whitespace-nowrap"
            href={signInUrl}
          >
            Login
          </Link>
        )} */}

        {!isAuthDisabled && user && (
          <form action="/api/auth/logout" method="POST">
            <button
              type="submit"
              className="text-sm sm:text-base transition-colors hover:bg-gray-300 rounded-md bg-gray-200 py-1 px-4 whitespace-nowrap"
            >
              Logout
            </button>
          </form>
        )}

        <Link
          className="text-sm sm:text-base rounded-md py-2 px-4 bg-purple-500 text-white hover:bg-purple-600 transition-colors duration-200 whitespace-nowrap mr-4 inline-flex items-center justify-center"
          href="/new-listing/form"
          onClick={handlePostJobClick}
        >
          Post a job
        </Link>

        <Link
          className="text-sm sm:text-base rounded-md py-2 px-4 bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-200 whitespace-nowrap inline-flex items-center justify-center"
          href="/headhunter"
          onClick={() => setMenuOpen(false)}
        >
          Headhunter
        </Link>


        {!isAuthDisabled && isJobPoster && user && (
          <Link
            className="text-sm sm:text-base rounded-md py-1 px-4 bg-gray-600 text-white hover:bg-gray-700 transition-colors duration-200 whitespace-nowrap"
            href="/dashboard"
            onClick={() => setMenuOpen(false)}
          >
            Dashboard
          </Link>
        )}
      </nav>
    </>
  );
}
