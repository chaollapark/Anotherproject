'use client';

import { useState, FormEvent } from 'react';

export default function NewsletterSignupForm() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/subscribers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      setMessage(data.message || 'An error occurred.');
      if (response.ok) setEmail('');
    } catch (error) {
      setMessage('Something went wrong. Please try again.');
    }

    setIsLoading(false);
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md space-y-4">
      <h2 className="text-2xl font-bold text-center text-gray-800">Subscribe to eujobs.co</h2>
      <p className="text-center text-gray-600">Get the best EU jobs delivered weekly to your inbox.</p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your.email@example.com"
          className="w-full px-4 py-2 text-gray-700 bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <button
          type="submit"
          disabled={isLoading}
          className="w-full px-4 py-2 font-bold text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {isLoading ? 'Subscribing...' : 'Subscribe'}
        </button>
      </form>
      {message && <p className="text-center text-sm text-gray-600 mt-4">{message}</p>}
    </div>
  );
}
