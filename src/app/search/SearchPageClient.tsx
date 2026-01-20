'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import SearchResultCard from '@/app/components/SearchResultCard';

interface SearchResult {
  id: string;
  type: 'job' | 'entity' | 'blog' | 'career-guide';
  title: string;
  description: string;
  url: string;
  metadata?: Record<string, any>;
  score?: number;
}

interface SearchResponse {
  results: SearchResult[];
  total: number;
  query: string;
  took: number;
}

type FilterType = 'all' | 'job' | 'entity' | 'blog' | 'career-guide';

export default function SearchPageClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQuery = searchParams.get('q') || '';
  
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [took, setTook] = useState(0);
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [offset, setOffset] = useState(0);
  const limit = 20;

  const performSearch = useCallback(async (searchQuery: string, filter: FilterType, searchOffset: number) => {
    if (!searchQuery || searchQuery.length < 2) {
      setResults([]);
      setTotal(0);
      return;
    }

    setIsLoading(true);
    try {
      const types = filter === 'all' ? '' : `&types=${filter}`;
      const response = await fetch(
        `/api/search?q=${encodeURIComponent(searchQuery)}&limit=${limit}&offset=${searchOffset}${types}`
      );
      
      if (response.ok) {
        const data: SearchResponse = await response.json();
        if (searchOffset === 0) {
          setResults(data.results);
        } else {
          setResults(prev => [...prev, ...data.results]);
        }
        setTotal(data.total);
        setTook(data.took);
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial search on page load
  useEffect(() => {
    if (initialQuery) {
      performSearch(initialQuery, activeFilter, 0);
    }
  }, [initialQuery, performSearch, activeFilter]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setOffset(0);
      router.push(`/search?q=${encodeURIComponent(query)}`);
      performSearch(query, activeFilter, 0);
    }
  };

  const handleFilterChange = (filter: FilterType) => {
    setActiveFilter(filter);
    setOffset(0);
    performSearch(query, filter, 0);
  };

  const handleLoadMore = () => {
    const newOffset = offset + limit;
    setOffset(newOffset);
    performSearch(query, activeFilter, newOffset);
  };

  const handleResultClick = (result: SearchResult) => {
    router.push(result.url);
  };

  const filterCounts = results.reduce((acc, result) => {
    acc[result.type] = (acc[result.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const filters: { key: FilterType; label: string; color: string }[] = [
    { key: 'all', label: 'All', color: 'gray' },
    { key: 'job', label: 'Jobs', color: 'blue' },
    { key: 'entity', label: 'Organizations', color: 'green' },
    { key: 'blog', label: 'Articles', color: 'purple' },
    { key: 'career-guide', label: 'Career Guides', color: 'orange' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Search</h1>
          
          {/* Search Form */}
          <form onSubmit={handleSearch} className="max-w-2xl">
            <div className="relative">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search jobs, organizations, articles..."
                className="w-full px-4 py-3 pl-12 text-lg border border-gray-300 rounded-lg 
                  focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
              <svg
                className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 bg-blue-600 
                  text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Search
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Results */}
      <div className="container mx-auto px-4 py-8">
        {query && (
          <>
            {/* Results Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div>
                {total > 0 ? (
                  <p className="text-gray-600">
                    Found <span className="font-semibold text-gray-900">{total}</span> results 
                    for &quot;<span className="font-semibold text-gray-900">{query}</span>&quot;
                    <span className="text-sm text-gray-400 ml-2">({took}ms)</span>
                  </p>
                ) : !isLoading ? (
                  <p className="text-gray-600">
                    No results found for &quot;<span className="font-semibold">{query}</span>&quot;
                  </p>
                ) : null}
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-2 mb-6">
              {filters.map((filter) => (
                <button
                  key={filter.key}
                  onClick={() => handleFilterChange(filter.key)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
                    ${activeFilter === filter.key
                      ? `bg-${filter.color}-600 text-white`
                      : `bg-${filter.color}-50 text-${filter.color}-700 hover:bg-${filter.color}-100`
                    }`}
                  style={{
                    backgroundColor: activeFilter === filter.key 
                      ? (filter.color === 'gray' ? '#4B5563' : undefined)
                      : undefined,
                  }}
                >
                  {filter.label}
                  {filter.key !== 'all' && filterCounts[filter.key] && (
                    <span className="ml-1 opacity-75">({filterCounts[filter.key]})</span>
                  )}
                </button>
              ))}
            </div>

            {/* Loading State */}
            {isLoading && results.length === 0 && (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent" />
              </div>
            )}

            {/* Results List */}
            {results.length > 0 && (
              <div className="space-y-2">
                {results.map((result) => (
                  <div key={result.id} className="bg-white rounded-lg shadow-sm border border-gray-200">
                    <SearchResultCard
                      result={result}
                      onClick={() => handleResultClick(result)}
                      query={query}
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Load More */}
            {results.length < total && (
              <div className="flex justify-center mt-8">
                <button
                  onClick={handleLoadMore}
                  disabled={isLoading}
                  className="px-6 py-3 bg-white border border-gray-300 rounded-lg text-gray-700 
                    font-medium hover:bg-gray-50 disabled:opacity-50 transition-colors"
                >
                  {isLoading ? 'Loading...' : `Load More (${results.length} of ${total})`}
                </button>
              </div>
            )}

            {/* No Results */}
            {!isLoading && results.length === 0 && query.length >= 2 && (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <svg className="w-16 h-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No results found</h3>
                <p className="text-gray-600 mb-4">Try different keywords or check your spelling</p>
                <div className="flex flex-wrap justify-center gap-2">
                  <span className="text-sm text-gray-500">Popular searches:</span>
                  {['Policy Officer', 'Brussels', 'European Commission', 'Internship'].map((term) => (
                    <button
                      key={term}
                      onClick={() => {
                        setQuery(term);
                        performSearch(term, activeFilter, 0);
                        router.push(`/search?q=${encodeURIComponent(term)}`);
                      }}
                      className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* Empty State */}
        {!query && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Start your search</h3>
            <p className="text-gray-600 mb-6">Search across jobs, organizations, articles, and career guides</p>
            <div className="flex flex-wrap justify-center gap-3">
              {['Jobs in Brussels', 'EU Policy', 'Internships', 'European Commission'].map((term) => (
                <button
                  key={term}
                  onClick={() => {
                    setQuery(term);
                    performSearch(term, activeFilter, 0);
                    router.push(`/search?q=${encodeURIComponent(term)}`);
                  }}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-full text-gray-700 
                    hover:bg-gray-50 hover:border-gray-400 transition-colors"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
