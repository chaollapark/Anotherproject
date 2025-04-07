// components/JobFilterBar.tsx
"use client";

import { useRouter } from 'next/navigation';

export default function JobFilterBar() {
  const router = useRouter();

  const filters = [
    { label: "Best EU jobs", path: "best-jobs" },
    { label: "EU Institutions", path: "eu-institutions-jobs" },
    { label: "EU Agencies", path: "eu-agencies-jobs" },
    { label: "Eurobrussels", path: "eurobrussels-jobs" },
    //immature as I am I named Euractiv jobs as "losers" and not there is too much code to change
    { label: "Euractiv", path: "euractiv-jobs" },
    { label: "JobsInBrussels", path:"jobs-in-Brussels"}
  ];

  return (
    <div className="flex flex-wrap justify-center gap-3 my-6">
      {filters.map(filter => (
        <button
          key={filter.path}
          onClick={() => router.push(`/${filter.path}`)}
          className="bg-blue-100 hover:bg-blue-200 px-4 py-2 rounded-lg"
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
}
