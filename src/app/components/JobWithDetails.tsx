// app/components/JobsWithDetails.tsx
'use client';

import React, { useState } from 'react';
import Jobs from '@/app/components/Jobs';
import JobDescription from '@/app/components/JobDescription';
import type { Job } from '@/models/Job';

interface JobsWithDetailsProps {
  jobs: Job[];
  header: string;
  isSearchResult?: boolean;
}

const JobsWithDetails: React.FC<JobsWithDetailsProps> = ({
  jobs,
  header,
  isSearchResult = false,
}) => {
  const [selectedJobId, setSelectedJobId] = useState<string | null>(jobs[0]?._id || null);

  const handleJobClick = (job: Job) => {
    setSelectedJobId(job._id);
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 gap-8 p-8 bg-gray-100">
      <Jobs
        header={header}
        initialJobs={jobs}
        isSearchResult={isSearchResult}
        onJobClick={handleJobClick}
        selectedJobId={selectedJobId}
      />
      {selectedJobId && <JobDescription jobId={selectedJobId} />}
    </div>
  );
};

export default JobsWithDetails;
