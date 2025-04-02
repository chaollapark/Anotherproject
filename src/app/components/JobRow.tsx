'use client';
import TimeAgo from "@/app/components/TimeAgo";
import {Job} from "@/models/Job";
import {faStar, faCopy, faShareAlt, faUpRightFromSquare} from "@fortawesome/free-solid-svg-icons";

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { useState } from 'react';

const JobDescription = ({ description }: { description: string }) => {
  return (
    <div className="relative">
      <div 
      className="border-y border-gray-100 prose prose-sm sm:prose lg:prose-lg max-w-none overflow-y-auto h-96 px-4 custom-scrollbar"
      style={{
        // Custom scrollbar styles
        scrollbarWidth: 'thin',
        scrollbarColor: '#CBD5E0 #EDF2F7'
      }}
    >
        <div
        dangerouslySetInnerHTML={{ __html: description }}
      />
      </div>
      </div>
  );
};

// Rest of the component remains the same
export default function JobRow({jobDoc}:{jobDoc:Job}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const isPro = jobDoc.plan === "pro" || jobDoc.plan === "recruiter";
  const slug: string = jobDoc.slug;
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async (slug: string) => {
    try {
      const url = `${window.location.origin}/jobs/${slug}`;
      await navigator.clipboard.writeText(url);
      return true;
    } catch (err) {
      console.error('Failed to copy:', err);
      return false;
    }
  };

  const shareOnLinkedIn = () => {
    const url = `${window.location.origin}/jobs/${slug}`;
    const linkedInShareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
    window.open(linkedInShareUrl, '_blank');
  };

  return (
    <div 
      className={`rounded-lg shadow-sm relative`}
    >
        <div className={`bg-white lg:p-4 py-4 p-2 rounded-lg relative ${isExpanded && 'shadow-md'}`}
      >
          {isPro && (
            <div className="absolute top-0 right-0 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs font-bold px-2 py-1 rounded-bl-lg rounded-tr-lg">
              <FontAwesomeIcon 
              icon={faStar} 
              className="mr-1 inline-block align-middle w-3.5 h-3.5" 
            />
                <span className="align-middle">featured</span>
              </div>
          )}
          <div className="flex grow gap-4 w-full hover:bg-gray-50 hover:cursor-pointer"
          onClick={() => 
          {setIsExpanded(!isExpanded)
              window.history.pushState({}, '', `/jobs/${slug}`);
            }}
        >
            <div className="grow sm:flex pl-2">
              <div className="grow">
                <div>
                  <div className="text-gray-600 text-sm font-medium">
                    {jobDoc.companyName || '?'}
                  </div>
                </div>
                <div className="font-bold text-lg mb-1">
                  <h2 className="text-gray-800">{jobDoc.title}</h2>
                </div>
                <div className="text-gray-500 text-sm capitalize flex flex-wrap gap-2">
                  <span className="bg-gray-100 px-2 py-0.5 rounded-full">{jobDoc.seniority}</span>
                  <span className="bg-gray-100 px-2 py-0.5 rounded-full">{jobDoc.city || 'Brussels'}, {jobDoc.country || 'Belgium'}</span>
                  <span className="bg-gray-100 px-2 py-0.5 rounded-full">{jobDoc.type}-time</span>
                </div>
              </div>
              {jobDoc.createdAt && (
                <div className="content-end text-gray-500 text-xs mt-2 sm:mt-0">
                  <TimeAgo createdAt={jobDoc.createdAt} />
                  </div>
              )}
            </div>
          </div>

          {/* Expanded Content */}
          {isExpanded && (
            <div className="mt-4 border-t pt-4 space-y-6 transition-all duration-200">
              <div className="flex lg:flex-row flex-col justify-end gap-4 px-2 text-sm">
                <button>
                  <a href={`${window.location.origin}/jobs/${slug}`}
                  target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
                >
                  <FontAwesomeIcon 
                  icon={faUpRightFromSquare} 
                  className="w-4 h-4" 
                />
                  Open Job Details
                </a>

                </button> 
                <button
                onClick={async (e) => {
                  e.stopPropagation(); // Prevent expanding/collapsing when clicking the button
                  const success = await copyToClipboard(slug);
                  if (success) {
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
                  }
                }}
                className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
              >
                  <FontAwesomeIcon 
                  icon={faCopy} 
                  className={`w-4 h-4 ${copied ? 'text-green-500' : ''}`} 
                />
                  <span className="">
                    {copied ? 'Copied!' : 'Copy link'}
                  </span>
                </button>
                <button
                onClick={shareOnLinkedIn}
                className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
              >
                  <FontAwesomeIcon 
                  icon={faShareAlt} 
                  className="w-4 h-4" 
                />
                  <span className="">Share on LinkedIn</span>
                </button>
              </div>
                {/* Job Description Section */}
                {jobDoc.description && (
                  <div className="mt-2">
                    <JobDescription description={jobDoc.description} />
                    </div>
                )}

                {/* Job Details Section */}
                <div className="bg-gray-100 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-700 mb-2">Job Details</h3>
                  <div className="space-y-2">
                    {/**jobDoc.salary && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Salary:</span>
                          <span className="font-medium">${jobDoc.salary.toLocaleString()}/year</span>
                        </div>
                    )**/}
                    <div className="flex justify-between">
                      <span className="text-gray-600">Location:</span>
                      <span className="font-medium text-right">{jobDoc.city}, {jobDoc.state}, {jobDoc.country}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Type:</span>
                      <span className="font-medium capitalize text-right">{jobDoc.type}-time</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Seniority:</span>
                      <span className="font-medium capitalize text-right">{jobDoc.seniority}</span>
                    </div>
                  </div>
                </div>

                {/* Contact Information Section */}
                {(jobDoc.contactName || jobDoc.contactEmail || jobDoc.contactPhone) && (
                  <div className="bg-gray-100 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-700 mb-2">Contact Information</h3>
                      <div className="space-y-2">
                        {jobDoc.contactName && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Contact Person:</span>
                              <span className="font-medium">{jobDoc.contactName}</span>
                            </div>
                        )}
                        {jobDoc.contactEmail && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Email:</span>
                              <span className="font-medium">{jobDoc.contactEmail}</span>
                            </div>
                        )}
                        {jobDoc.contactPhone && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Phone:</span>
                              <span className="font-medium">{jobDoc.contactPhone}</span>
                            </div>
                        )}
                      </div>
                    </div>
                )}

                {jobDoc.applyLink && (
                  <div className="mt-4 text-center">
                    <a
                      href={jobDoc.applyLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block bg-indigo-600 text-white px-6 py-2 rounded-md font-semibold hover:bg-indigo-700 transition-colors"
                    >
                      Apply for this position
                    </a>
                  </div>
                )}


                <div className="text-xs text-gray-600 italic mt-2 text-center">
                  {parseInt(jobDoc._id.slice(-1), 16) % 3 === 0
                    ? "Don't forget to mention EUJobs.co as your source for policy jobs in Brussels! Other sites like Euractiv Jobs and EuroBrussels are also out there, but we're glad you found us!"
                    : parseInt(jobDoc._id.slice(-1), 16) % 3 === 1
                      ? "Discover why EUJobs.co is a leading source for policy jobs in Brussels. Feel free to explore other options, like Euractiv Jobs and EuroBrussels, but we're confident you'll find the best here!"
                      : "Looking for policy jobs in Brussels? EUJobs.co has you covered! We bring you roles similar to those on Euractiv Jobs and EuroBrussels, tailored for the EU bubble."
                }
                </div>
              </div>
          )}
        </div>
      </div>
  );
}
