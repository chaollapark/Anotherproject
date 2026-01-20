'use client';

import React from 'react';

interface SearchResult {
  id: string;
  type: 'job' | 'entity' | 'blog' | 'career-guide';
  title: string;
  description: string;
  url: string;
  metadata?: Record<string, any>;
  score?: number;
}

interface SearchResultCardProps {
  result: SearchResult;
  isSelected?: boolean;
  onClick: () => void;
  query?: string;
}

const typeConfig = {
  job: {
    label: 'Job',
    bgColor: 'bg-blue-100',
    textColor: 'text-blue-800',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
  entity: {
    label: 'Organization',
    bgColor: 'bg-green-100',
    textColor: 'text-green-800',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
  },
  blog: {
    label: 'Article',
    bgColor: 'bg-purple-100',
    textColor: 'text-purple-800',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
      </svg>
    ),
  },
  'career-guide': {
    label: 'Career Guide',
    bgColor: 'bg-orange-100',
    textColor: 'text-orange-800',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
  },
};

export default function SearchResultCard({
  result,
  isSelected = false,
  onClick,
  query,
}: SearchResultCardProps) {
  const config = typeConfig[result.type];

  // Highlight matching text
  const highlightText = (text: string) => {
    if (!query || !text) return text;
    
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-200 rounded px-0.5">{part}</mark>
      ) : (
        part
      )
    );
  };

  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-4 py-3 rounded-lg transition-colors duration-150
        ${isSelected ? 'bg-blue-50 border-blue-200' : 'hover:bg-gray-50'}
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1`}
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className={`flex-shrink-0 p-2 rounded-lg ${config.bgColor} ${config.textColor}`}>
          {config.icon}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${config.bgColor} ${config.textColor}`}>
              {config.label}
            </span>
            {result.metadata?.companyName && (
              <span className="text-xs text-gray-500 truncate">
                {result.metadata.companyName}
              </span>
            )}
            {result.metadata?.organization && (
              <span className="text-xs text-gray-500 truncate">
                {result.metadata.organization}
              </span>
            )}
          </div>

          <h4 className="font-medium text-gray-900 truncate">
            {highlightText(result.title)}
          </h4>

          <p className="text-sm text-gray-600 line-clamp-2 mt-1">
            {highlightText(result.description)}
          </p>

          {/* Metadata */}
          <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
            {result.metadata?.city && result.metadata?.country && (
              <span className="flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {result.metadata.city}, {result.metadata.country}
              </span>
            )}
            {result.metadata?.seniority && (
              <span className="capitalize">{result.metadata.seniority}</span>
            )}
            {result.metadata?.category && (
              <span className="truncate max-w-[150px]">{result.metadata.category}</span>
            )}
            {result.metadata?.wordCount && (
              <span>{result.metadata.wordCount.toLocaleString()} words</span>
            )}
          </div>
        </div>

        {/* Arrow */}
        <div className="flex-shrink-0 text-gray-400">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </button>
  );
}
