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
        eujobs.co - Policy jobs in <span className='underline'>Brussels</span>
      </h1>
      
      <div className="flex max-w-4xl mx-auto">
        {/* Search Section */}
        <div className="w-full bg-white rounded-xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow">
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

        {/* Newsletter Signup Section */}
        {/*
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow">
          <h2 className="text-lg font-semibold mb-3 text-gray-800">Weekly Updates</h2>
          <form 
            action="https://eujobs.us3.list-manage.com/subscribe/post?u=7dbc2eeed61fd04abc087d331&amp;id=889f03a7b8&amp;f_id=003923e1f0" 
            method="post" 
            id="mc-embedded-subscribe-form" 
            name="mc-embedded-subscribe-form" 
            className="validate flex flex-col gap-3" 
            target="_blank"
          >
            <div className="flex flex-col gap-1">
              <label htmlFor="mce-EMAIL" className="text-sm text-gray-600">
                eurobrussels bubble events & jobs weekly <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="EMAIL"
                id="mce-EMAIL"
                required
                className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your email"
              />
            </div>
            <div aria-hidden="true" style={{ position: 'absolute', left: '-5000px' }}>
              <input type="text" name="b_7dbc2eeed61fd04abc087d331_889f03a7b8" tabIndex={-1} />
            </div>
            
            <button
              type="submit"
              name="subscribe"
              id="mc-embedded-subscribe"
              className="bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Subscribe
            </button>
          </form>
        </div>
          */}  
      </div>
    </section>
  );
}
