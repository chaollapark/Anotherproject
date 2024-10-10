'use client'

import { useState, useEffect } from 'react';
import SingleJobPage from "@/app/components/JobDescription";
import JobRow from "@/app/components/JobRow";
import { Job } from '@/models/Job';

export default function DynamicJobDescription({ jobs, initialJobId }: { jobs: Job[], initialJobId: string }) {
  const [selectedJobId, setSelectedJobId] = useState<string>(initialJobId);

  useEffect(() => {
    const handleJobSelection = (event: CustomEvent<{ jobId: string }>) => {
      if (event.detail && event.detail.jobId) {
        setSelectedJobId(event.detail.jobId);
      }
    };

    window.addEventListener('jobSelected', handleJobSelection as EventListener);

    return () => {
      window.removeEventListener('jobSelected', handleJobSelection as EventListener);
    };
  }, []);

  return (
    <div className="flex">
      <div className="w-1/2">
        {jobs.map((job: Job) => (
          <JobRow key={job._id} jobDoc={job} />
        ))}
      </div>
      <div className="w-1/2">
        <SingleJobPage params={{ jobId: selectedJobId }} />
      </div>
    </div>
  );
}