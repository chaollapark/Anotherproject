'use client'

import JobRow from "@/app/components/JobRow";
import type {Job} from "@/models/Job";

export default function Jobs({ header, jobs }: { header: string, jobs: Job[] }) {
  const handleJobClick = (jobId: string) => {
    window.dispatchEvent(new CustomEvent('jobSelected', { detail: { jobId } }));
  };

  return (
    <div>
      <h2>{header}</h2>
      <ul className="space-y-4">
        {jobs.map((job) => (
          <li key={job._id}>
            <button 
              className="w-full text-left" 
              onClick={() => handleJobClick(job._id.toString())}
            >
              <JobRow jobDoc={job} />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}