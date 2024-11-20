'use client';
import { useEffect, useState } from 'react';
import { Job } from '@/models/Job';
import axios from 'axios';
import TimeAgo from "@/app/components/TimeAgo";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faBriefcase, 
  faBuilding, 
  faLocationDot, 
  faMoneyBill, 
  faUser, 
  faEnvelope, 
  faPhone,
  faStar,
  faCopy
} from "@fortawesome/free-solid-svg-icons";

export default function JobPage({ params }: { params: { id: string } }) {
  const [copied, setCopied] = useState(false);
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const copyToClipboard = async () => {
    try {
      const url = window.location.href;
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      return true;
    } catch (err) {
      console.error('Failed to copy:', err);
      return false;
    }
  };
  useEffect(() => {
    async function fetchJob() {
      try {
        const response = await axios.get(`/api/jobs/${params.id}`);
        setJob(response.data);
      } catch (err) {
        setError('Failed to fetch job details');
      } finally {
        setLoading(false);
      }
    }
    fetchJob();
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
        </div>
    );
  }

  if (error || !job) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
          <p className="font-bold">Error</p>
          <p>{error || 'Job not found'}</p>
        </div>
        </div>
    );
  }

  const isPro = job.plan === 'pro';

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header Section */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-6 relative">
            {isPro && (
              <div className="absolute top-0 right-0 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-3 py-1 rounded-bl-lg">
                <FontAwesomeIcon icon={faStar} className="mr-2" />
                Featured
              </div>
            )}

            {/* Company and Job Title */}
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">{job.title}</h1>
              <div className="flex items-center text-gray-600">
                <FontAwesomeIcon icon={faBuilding} className="mr-2" />
                <span className="text-lg">{job.companyName}</span>
              </div>
            </div>

            {/* Key Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              <div className="flex items-center text-gray-700">
                <FontAwesomeIcon icon={faBriefcase} className="mr-2" />
                <span className="capitalize">{job.type}-time · {job.seniority}</span>
              </div>

              <div className="flex items-center text-gray-700">
                <FontAwesomeIcon icon={faLocationDot} className="mr-2" />
                <span>{job.city}, {job.country}</span>
              </div>

              {job.salary && (
                <div className="flex items-center text-gray-700">
                  <FontAwesomeIcon icon={faMoneyBill} className="mr-2" />
                    <span>€{job.salary.toLocaleString()} per year</span>
                  </div>
              )}
            </div>

            {/* Posted Time and Copy Link */}
            <div className="flex justify-between items-center text-sm text-gray-500">
              <div>
              Posted <TimeAgo createdAt={job.createdAt} />
              </div>
              <button
              onClick={copyToClipboard}
              className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors p-2 rounded-lg hover:bg-gray-100"
            >
                <FontAwesomeIcon 
                icon={faCopy} 
                className={`w-4 h-4 ${copied ? 'text-green-500' : ''}`} 
              />
                <span className="text-sm">
                  {copied ? 'Copied!' : 'Copy link'}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Description Section */}
        <div className="bg-white rounded-lg shadow-lg mt-6 p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Job Description</h2>
          <div className="prose prose-blue max-w-none"
          dangerouslySetInnerHTML={{ __html: job.description }}
        />
        </div>

        {/* Contact Information */}
        {(job.contactName || job.contactEmail || job.contactPhone) && (
          <div className="bg-white rounded-lg shadow-lg mt-6 p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Contact Information</h2>
              <div className="space-y-3">
                {job.contactName && (
                  <div className="flex items-center text-gray-700">
                    <FontAwesomeIcon icon={faUser} className="mr-3 w-5" />
                      <span>{job.contactName}</span>
                    </div>
                )}
                {job.contactEmail && (
                  <div className="flex items-center text-gray-700">
                    <FontAwesomeIcon icon={faEnvelope} className="mr-3 w-5" />
                      <a href={`mailto:${job.contactEmail}`} className="text-blue-600 hover:text-blue-800">
                        {job.contactEmail}
                      </a>
                    </div>
                )}
                {job.contactPhone && (
                  <div className="flex items-center text-gray-700">
                    <FontAwesomeIcon icon={faPhone} className="mr-3 w-5" />
                      <a href={`tel:${job.contactPhone}`} className="text-blue-600 hover:text-blue-800">
                        {job.contactPhone}
                      </a>
                    </div>
                )}
              </div>
            </div>
        )}

        {/* Location Details */}
        {(job.city || job.state || job.country) && (
          <div className="bg-white rounded-lg shadow-lg mt-6 p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Location</h2>
              <div className="flex items-center text-gray-700">
                <FontAwesomeIcon icon={faLocationDot} className="mr-3" />
                <span>{[job.city, job.state, job.country].filter(Boolean).join(', ')}</span>
              </div>
            </div>
        )}

        {/* Apply Button */}
        <div className="mt-6 flex justify-center">
          <a
          href={`mailto:${job.contactEmail}?subject=Application for ${job.title} position`}
          className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200"
        >
          Apply for this position
        </a>
        </div>
      </div>
  );
}
