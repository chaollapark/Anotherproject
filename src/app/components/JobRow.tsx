'use client';
import TimeAgo from "@/app/components/TimeAgo";
import {Job} from "@/models/Job";
import {faHeart} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import Image from 'next/image';
import { useState, MouseEvent } from 'react';

// Define a simple SVG icon as a string
const defaultIconSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="none">
  <rect width="48" height="48" fill="#E5E7EB"/>
  <path d="M24 14C19.5817 14 16 17.5817 16 22C16 24.9728 17.9168 27.4593 20.6251 28.5H27.3749C30.0832 27.4593 32 24.9728 32 22C32 17.5817 28.4183 14 24 14Z" fill="#9CA3AF"/>
  <path d="M14 34C14 30.6863 16.6863 28 20 28H28C31.3137 28 34 30.6863 34 34V34H14V34Z" fill="#9CA3AF"/>
</svg>
`;

// Convert the SVG string to a data URL
const defaultIconDataUrl = `data:image/svg+xml,${encodeURIComponent(defaultIconSvg)}`;

export default function JobRow({
  jobDoc
}: {
  jobDoc: Job;
}) {
  const [imgSrc, setImgSrc] = useState(jobDoc.jobIcon || defaultIconDataUrl);

  if (!jobDoc) {
    return null;
  }

  const handleClick = (e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    // Dispatch a custom event with the job ID
    const event = new CustomEvent('jobSelected', { detail: { jobId: jobDoc.id } });
    window.dispatchEvent(event);
  };

  return (
    <div 
      className="bg-white p-4 rounded-lg shadow-sm relative hover:bg-gray-50 transition-colors cursor-pointer"
      onClick={handleClick}
    >
      <div className="absolute top-4 right-4">
        <FontAwesomeIcon className="size-4 text-gray-300" icon={faHeart} />
      </div>
      <div className="flex grow gap-4">
        <div className="content-center w-12 basis-12 shrink-0">
          <Image
            className="size-12"
            src={imgSrc.replace(/\+/g, '%2B')}
            alt="Icon for job listing company"
            width={48}
            height={48}
            onError={() => setImgSrc(defaultIconDataUrl)}
          />
        </div>
        <div className="grow sm:flex">
          <div className="grow">
            <div className="text-gray-500 text-sm">{jobDoc.orgName || '?'}</div>
            <div className="font-bold text-lg mb-1">{jobDoc.title || 'Untitled Job'}</div>
            <div className="text-gray-400 text-sm capitalize">
              {jobDoc.seniority || 'Not specified'}
              {' '}&middot;{' '}
              {jobDoc.city || 'Brussels'}, {jobDoc.country || 'Belgium'}
              {' '}&middot;{' '}
              {jobDoc.type || 'Full'}-time
            </div>
          </div>
          {jobDoc.createdAt && (
            <div className="content-end text-gray-500 text-sm">
              <TimeAgo createdAt={jobDoc.createdAt} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}