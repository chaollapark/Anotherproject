'use client';

import React, { useState } from 'react';
import JobRow from "@/app/components/JobRow";
import type { Job } from "@/models/Job";
import { Button } from '@radix-ui/themes';

interface JobsProps {
  header: string;
  initialJobs: Job[];
}

export default function Jobs({ header, initialJobs }: JobsProps) {
  const [jobs, setJobs] = useState<Job[]>(initialJobs);
  const [loading, setLoading] = useState(false);

  const loadMoreJobs = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/jobs?count=${jobs.length}`);
      const newJobs = await response.json();
      setJobs([...jobs, ...newJobs]);
    } catch (error) {
      console.error('Error loading more jobs:', error);
    }
    setLoading(false);
  };

  return (
    <div className="bg-slate-200 py-6 rounded-3xl">
      <div className="container">
        <h2 className="font-bold mb-4">{header || 'Recent jobs'}</h2>
        <div className="flex flex-col gap-4">
          {jobs.length === 0 ? (
            <div>No jobs found</div>
          ) : (
            jobs.map(job => (
              <JobRow key={job._id} jobDoc={job} />
            ))
          )}
        </div>
        {jobs.length >= 10 && (
          <div className="mt-6 text-center">
            <Button onClick={loadMoreJobs} disabled={loading} 
            className="!text-white !rounded-md !py-1 !px-2 sm:py-2 sm:px-4 !bg-gray-500 text-white hover:!bg-gray-600 !transition-colors">
              {loading ? 'Loading...' : 'Load More Jobs'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
