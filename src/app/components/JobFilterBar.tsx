// components/JobFilterBar.tsx
"use client";

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function JobFilterBar() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/all-jobs?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="flex justify-center my-6">
      <form onSubmit={handleSearch} className="flex gap-2">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search for jobs..."
          className="border border-gray-300 rounded-lg px-4 py-2 w-80"
        />
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          Search
        </button>
      </form>
    </div>
  );
}
