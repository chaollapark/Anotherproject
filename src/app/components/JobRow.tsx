// app/components/JobRow.tsx
'use client';

import React from 'react';
import TimeAgo from '@/app/components/TimeAgo';
import { Job } from '@/models/Job';
import { faHeart, faStar } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface JobRowProps {
  jobDoc: Job;
  onJobClick?: (job: Job) => void;
  isSelected?: boolean;
}

export default function JobRow({ jobDoc, onJobClick, isSelected }: JobRowProps) {
  const isPro = jobDoc.plan === 'pro';

  return (
    <div
      className={`rounded-lg shadow-sm relative cursor-pointer ${
        isSelected ? 'bg-gray-200' : 'bg-white'
      }`}
      onClick={() => onJobClick?.(jobDoc)}
      role="button"
      tabIndex={0}
      onKeyPress={(e) => {
        if (e.key === 'Enter') onJobClick?.(jobDoc);
      }}
    >
      <div className="p-4 rounded-lg relative">
        {isPro && (
          <div className="absolute top-0 right-0 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs font-bold px-2 py-1 rounded-bl-lg rounded-tr-lg">
            <FontAwesomeIcon icon={faStar} className="mr-1" /> featured
          </div>
        )}
        <div className="flex grow gap-4">
          <div className="grow sm:flex pl-2">
            <div className="grow">
              <div>
                <div className="text-gray-600 text-sm font-medium">
                  {jobDoc.companyName || '?'}
                </div>
              </div>
              <div className="font-bold text-lg mb-1">
                <span className="hover:underline text-gray-800">{jobDoc.title}</span>
              </div>
              <div className="text-gray-500 text-sm capitalize flex flex-wrap gap-2">
                <span className="bg-gray-100 px-2 py-0.5 rounded-full">{jobDoc.seniority}</span>
                <span className="bg-gray-100 px-2 py-0.5 rounded-full">
                  {jobDoc.city || 'Brussels'}, {jobDoc.country || 'Belgium'}
                </span>
                <span className="bg-gray-100 px-2 py-0.5 rounded-full">{jobDoc.type}-time</span>
              </div>
            </div>
            {jobDoc.createdAt && (
              <div className="content-end text-gray-500 text-sm mt-2 sm:mt-0">
                <TimeAgo createdAt={jobDoc.createdAt} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
