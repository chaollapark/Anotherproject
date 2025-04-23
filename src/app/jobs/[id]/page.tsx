import { Metadata } from "next";
import JobPageClient from "./JobPageClient";

type Params = { id: string };

/** Self-referencing canonical for each job page */
export async function generateMetadata(
  { params }: { params: Params }
): Promise<Metadata> {
  return {
    alternates: {
      canonical: `/jobs/${params.id}`,               // → https://www.eujobs.co/jobs/…
    },
  };
}

/** Simply renders the client component */
export default function JobPage({ params }: { params: Params }) {
  return <JobPageClient params={params} />;
}