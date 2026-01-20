'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import SearchModal from './SearchModal';

interface SearchBarProps {
  placeholder?: string;
  className?: string;
  showShortcut?: boolean;
}

export default function SearchBar({
  placeholder = 'Search jobs, organizations, articles...',
  className = '',
  showShortcut = true,
}: SearchBarProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  // Handle keyboard shortcut (Cmd/Ctrl + K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsModalOpen(true);
      }
      if (e.key === 'Escape') {
        setIsModalOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSearchSubmit = (query: string) => {
    setIsModalOpen(false);
    router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <>
      {/* Search Trigger Button */}
      <button
        onClick={() => setIsModalOpen(true)}
        className={`flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 
          rounded-lg border border-gray-300 text-gray-500 transition-colors duration-200 ${className}`}
      >
        <svg
          className="w-5 h-5"
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
        <span className="hidden sm:inline text-sm">{placeholder}</span>
        {showShortcut && (
          <kbd className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 text-xs 
            font-medium text-gray-500 bg-gray-200 rounded">
            <span className="text-xs">⌘</span>K
          </kbd>
        )}
      </button>

      {/* Search Modal */}
      <SearchModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSearch={handleSearchSubmit}
      />
    </>
  );
}
