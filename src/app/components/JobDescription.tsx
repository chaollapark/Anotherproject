// app/components/JobDescription.tsx
'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import type { Job } from '@/models/Job';

interface JobDescriptionProps {
  jobId: string;
}

export default function JobDescription({ jobId }: JobDescriptionProps) {
  const [jobDoc, setJobDoc] = useState<Job | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchJob = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/job/${jobId}`);
        console.log('response', response);
        if (!response.ok) {
          throw new Error('Failed to fetch job data');
        }
        const data: Job = await response.json();
        setJobDoc(data);
      } catch (err) {
        console.error('Error fetching job:', err);
        setError('Failed to load job details.');
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [jobId]);

  if (loading) {
    return <div className="container mt-8 my-6">Loading job details...</div>;
  }

  if (error || !jobDoc) {
    return <div className="container mt-8 my-6">Error: {error || 'Job not found'}</div>;
  }

  return (
    <div className="container mt-8 my-6">
      <div className="sm:flex">
        <div className="grow">
          <h1 className="text-4xl mb-2">{jobDoc.title}</h1>
          <div className="capitalize text-sm text-blue-800 mb-4">
            {jobDoc.remote} &middot; {jobDoc.city}, {jobDoc.country} &middot; {jobDoc.type}-time
          </div>
        </div>
        {jobDoc.jobIcon && (
          <div>
            <Image
              src={jobDoc.jobIcon}
              alt={'job icon'}
              width={64}
              height={64}
              className="w-auto h-auto max-w-16 max-h-16"
            />
          </div>
        )}
      </div>
      <div className="whitespace-pre-line text-sm text-gray-600">{jobDoc.description}</div>
      <div className="mt-4 bg-gray-200 p-8 rounded-lg">
        <h3 className="font-bold mb-2">Apply by contacting us</h3>
        <div className="flex gap-4">
          {jobDoc.contactPhoto && (
            <Image
              src={jobDoc.contactPhoto}
              alt={'contact person'}
              width={96}
              height={96}
              className="w-auto h-auto max-w-24 max-h-24"
            />
          )}
          <div className="flex flex-col justify-center">
            <p>{jobDoc.contactName}</p>
            <p>Email: {jobDoc.contactEmail}</p>
            <p>Phone: {jobDoc.contactPhone}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
