"use server";
import { getSignInUrl, withAuth, signOut } from "@workos-inc/authkit-nextjs";
import Link from "next/link";
import Image from "next/image";
import { getCustomUser } from "@/app/actions/userActions";
import HeaderClient from "./HeaderClient";

export default async function Header() {
  const isAuthDisabled = process.env.DISABLE_AUTH === "true";
  const { user } = !isAuthDisabled ? await withAuth() : { user: null };
  const signInUrl = !isAuthDisabled ? await getSignInUrl() : "";

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
        <Link href={"/"} className="font-bold text-xl group">
          <span className="flex items-center">
            eujobs.co
            <Image
              src="/eu-flag.png"
              alt="EU jobs in brussels"
              width={32}
              height={32}
              className="ml-2 inline-block transition-all group-hover:rotate-90 duration-300"
            />
          </span>
        </Link>
        {/* Pass data to the Client Component */}
        <HeaderClient
          isAuthDisabled={isAuthDisabled}
          user={user}
          signInUrl={signInUrl}
          isJobPoster={isJobPoster}
        />
      </div>
    </header>
  );
}
