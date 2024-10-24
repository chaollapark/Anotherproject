"use server"
import { getSignInUrl, getUser, signOut } from "@workos-inc/authkit-nextjs";
import Link from "next/link";
import Image from "next/image";
import { getCustomUser } from "@/app/actions/userActions";
import * as Tooltip from '@radix-ui/react-tooltip';

export default async function Header() {
  const { user } = await getUser();
  const signInUrl = await getSignInUrl();
  let isJobPoster = true;  // Default to true

  if (user) {
    try {
      const customUser = await getCustomUser();
      isJobPoster = customUser?.isJobPoster ?? true;  // Use nullish coalescing with true as default
    } catch (error) {
      console.error("Error fetching custom user:", error);
      // Error occurred, but we'll keep isJobPoster as true
    }
  }

  return (
    <header>
      <div className="container flex items-center justify-between mx-auto my-4">
        <Link href={'/'} className="font-bold text-xl group">
          <span className="flex items-center">
            eujobs.co
          <Image 
            src="/eu-flag.png" 
            alt="EU commission jobs opportunities in Brussels" 
            width={32} 
            height={32} 
            className="ml-2 inline-block transition-all group-hover:rotate-90 duration-300"
          />
          </span>
        </Link>
        <nav className="flex gap-2">
          {!user && (
            <Link className="transition-colors hover:bg-gray-300 rounded-md bg-gray-200 py-1 px-2 sm:py-2 sm:px-4" href={signInUrl}>
              Login
            </Link>
          )}
          {user && (
            <>
              <form action={async () => {
                'use server';
                await signOut();
              }}>
                <button type="submit" className="transition-colors hover:bg-gray-300 rounded-md bg-gray-200 py-1 px-2 sm:py-2 sm:px-4">
                  Logout
                </button>
              </form>
            </>
          )}
          {isJobPoster && (
            <Link
            className={"rounded-md py-1 px-2 sm:py-2 sm:px-4 bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-200"}
            href="/new-listing/form"
            >
            Post a job
            </Link>
          )}
          {isJobPoster && user && (
            <Link
            className="rounded-md py-1 px-2 sm:py-2 sm:px-4 bg-gray-600 text-white hover:bg-gray-700 transition-colors duration-200"
            href="/dashboard"
            >
              Dashboard
            </Link>
          )}
          </nav>
      </div>
    </header>
  );
}
