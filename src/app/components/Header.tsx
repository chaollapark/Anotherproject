"use server";
import Link from "next/link";
import Image from "next/image";
import { getCustomUser } from "@/app/actions/userActions";
import HeaderClient from "./HeaderClient";

export default async function Header() {
  // Authentication removed - simplified header
  const isAuthDisabled = true;
  const user = null;
  const signInUrl = "";
  const isJobPoster = true;

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
