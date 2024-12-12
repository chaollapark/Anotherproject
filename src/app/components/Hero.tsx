'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Hero() {
  const [searchPhrase, setSearchPhrase] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    router.push(`/?search=${encodeURIComponent(searchPhrase)}`);
  };

  return (
    <section className="container my-8">
      <h1 className="text-4xl font-bold text-center mb-6">
        LobbyingLondon - Policy jobs in <span className='text-yellow-500'>London</span>
      </h1>
      
      <div className="max-w-4xl mx-auto">
        {/* Search Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow">
          <h2 className="text-lg font-semibold mb-3 text-gray-800">Search Jobs</h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <label htmlFor="search" className="text-sm text-gray-600">
                Search for your next job in policy
              </label>
              <input
                id="search"
                type="search"
                className="border border-gray-300 w-full py-2 px-4 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Policy Analyst"
                value={searchPhrase}
                onChange={(e) => setSearchPhrase(e.target.value)}
              />
            </div>
            <button 
              type="submit" 
              className="transition-colors bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg"
            >
              Search
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
