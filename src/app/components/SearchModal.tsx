'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import SearchResultCard from './SearchResultCard';

interface SearchResult {
  id: string;
  type: 'job' | 'entity' | 'blog' | 'career-guide';
  title: string;
  description: string;
  url: string;
  metadata?: Record<string, any>;
  score?: number;
}

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSearch?: (query: string) => void;
}

export default function SearchModal({ isOpen, onClose, onSearch }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Load recent searches from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('recentSearches');
      if (saved) {
        setRecentSearches(JSON.parse(saved));
      }
    }
  }, []);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
      setQuery('');
      setResults([]);
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Debounced search
  useEffect(() => {
    if (!query || query.length < 2) {
      setResults([]);
      return;
    }

    const timeoutId = setTimeout(async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}&limit=8`);
        if (response.ok) {
          const data = await response.json();
          setResults(data.results || []);
        }
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query]);

  // Save to recent searches
  const saveRecentSearch = useCallback((searchQuery: string) => {
    if (!searchQuery.trim()) return;
    
    const updated = [searchQuery, ...recentSearches.filter(s => s !== searchQuery)].slice(0, 5);
    setRecentSearches(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('recentSearches', JSON.stringify(updated));
    }
  }, [recentSearches]);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => Math.min(prev + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (results[selectedIndex]) {
        handleResultClick(results[selectedIndex]);
      } else if (query.trim()) {
        handleFullSearch();
      }
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  const handleResultClick = (result: SearchResult) => {
    saveRecentSearch(query);
    onClose();
    router.push(result.url);
  };

  const handleFullSearch = () => {
    if (query.trim()) {
      saveRecentSearch(query);
      onClose();
      if (onSearch) {
        onSearch(query);
      } else {
        router.push(`/search?q=${encodeURIComponent(query)}`);
      }
    }
  };

  const handleRecentSearchClick = (searchQuery: string) => {
    setQuery(searchQuery);
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('recentSearches');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative min-h-screen flex items-start justify-center pt-16 sm:pt-24 px-4">
        <div className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl overflow-hidden">
          {/* Search Input */}
          <div className="flex items-center border-b border-gray-200 px-4">
            <svg
              className="w-5 h-5 text-gray-400"
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
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search jobs, organizations, articles..."
              className="flex-1 px-4 py-4 text-lg outline-none placeholder-gray-400"
            />
            {isLoading && (
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-500 border-t-transparent" />
            )}
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600"
            >
              <kbd className="px-2 py-1 text-xs bg-gray-100 rounded">ESC</kbd>
            </button>
          </div>

          {/* Results */}
          <div className="max-h-[60vh] overflow-y-auto">
            {/* Recent Searches */}
            {!query && recentSearches.length > 0 && (
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Recent Searches
                  </span>
                  <button
                    onClick={clearRecentSearches}
                    className="text-xs text-gray-400 hover:text-gray-600"
                  >
                    Clear
                  </button>
                </div>
                <div className="space-y-1">
                  {recentSearches.map((search, index) => (
                    <button
                      key={index}
                      onClick={() => handleRecentSearchClick(search)}
                      className="flex items-center gap-2 w-full px-3 py-2 text-left text-gray-700 
                        hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {search}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Search Results */}
            {query && results.length > 0 && (
              <div className="p-2">
                {results.map((result, index) => (
                  <SearchResultCard
                    key={result.id}
                    result={result}
                    isSelected={index === selectedIndex}
                    onClick={() => handleResultClick(result)}
                    query={query}
                  />
                ))}
              </div>
            )}

            {/* No Results */}
            {query && query.length >= 2 && !isLoading && results.length === 0 && (
              <div className="p-8 text-center">
                <div className="text-gray-400 mb-2">
                  <svg className="w-12 h-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-gray-600">No results found for &quot;{query}&quot;</p>
                <p className="text-sm text-gray-400 mt-1">Try different keywords or check spelling</p>
              </div>
            )}

            {/* Quick Tips */}
            {!query && recentSearches.length === 0 && (
              <div className="p-6 text-center text-gray-500">
                <p className="mb-4">Search across the entire site</p>
                <div className="flex flex-wrap justify-center gap-2">
                  <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">Jobs</span>
                  <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm">Organizations</span>
                  <span className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-sm">Blog Articles</span>
                  <span className="px-3 py-1 bg-orange-50 text-orange-700 rounded-full text-sm">Career Guides</span>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          {query && results.length > 0 && (
            <div className="border-t border-gray-200 px-4 py-3 bg-gray-50">
              <button
                onClick={handleFullSearch}
                className="w-full text-center text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                View all results for &quot;{query}&quot; →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
