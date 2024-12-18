"use server"
import { getSignInUrl, withAuth, signOut } from "@workos-inc/authkit-nextjs";
import Link from "next/link";
import Image from "next/image";
import { getCustomUser } from "@/app/actions/userActions";

export default async function Header() {
  const isAuthDisabled = process.env.DISABLE_AUTH === 'true';
  const { user } = !isAuthDisabled ? await withAuth() : { user: null };
  const signInUrl = !isAuthDisabled ? await getSignInUrl() : '';
  
  let isJobPoster = true;
  if (user && !isAuthDisabled) {
    try {
      const customUser = await getCustomUser();
      isJobPoster = customUser?.isJobPoster ?? true;
    } catch (error) {
      console.error("Error fetching custom user:", error);
    }
  }

  return (
    <header>
      <div className="container flex flex-wrap items-center justify-between mx-auto my-4 gap-4">
        <Link href={'/'} className="font-bold text-xl group">
          <span className="flex items-center">
            LobbyingLondon
            <Image 
              src="/united-kingdom.png" 
              title="Icon by Riajulislam from Flaticon"
              alt="Policy jobs in London" 
              width={32} 
              height={32} 
              className="ml-2 inline-block transition-all group-hover:rotate-90 duration-300"
            />
          </span>
        </Link>

        <nav className="flex flex-wrap gap-2 w-full md:w-auto">
          {!isAuthDisabled && !user && (
            <Link 
              className="text-sm sm:text-base transition-colors hover:bg-gray-300 rounded-md bg-gray-200 py-1 px-2 sm:py-2 sm:px-4 whitespace-nowrap" 
              href={signInUrl}
            >
              Login
            </Link>
          )}
          
          {!isAuthDisabled && user && (
            <form action={async () => {
              'use server';
              await signOut();
            }}>
              <button 
                type="submit" 
                className="text-sm sm:text-base transition-colors hover:bg-gray-300 rounded-md bg-gray-200 py-1 px-2 sm:py-2 sm:px-4 whitespace-nowrap"
              >
                Logout
              </button>
            </form>
          )}
          
          <Link
            className="text-sm sm:text-base rounded-md py-1 px-2 sm:py-2 sm:px-4 bg-indigo-600 text-white hover:bg-indigo-700 transition-colors duration-200 whitespace-nowrap"
            href="/new-listing/form"
          >
            Post a job
          </Link>
          
          {!isAuthDisabled && isJobPoster && user && (
            <Link
              className="text-sm sm:text-base rounded-md py-1 px-2 sm:py-2 sm:px-4 bg-gray-600 text-white hover:bg-gray-700 transition-colors duration-200 whitespace-nowrap"
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
