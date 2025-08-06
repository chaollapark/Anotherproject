'use client';

import { useState } from 'react';

interface EmailSubscriptionProps {
  title?: string;
  subtitle?: string;
  buttonText?: string;
  className?: string;
}

export default function EmailSubscription({
  title = "Get Daily Job Alerts",
  subtitle = "Be the first to know about new EU opportunities. Apply early and increase your chances!",
  buttonText = "Subscribe Now",
  className = ""
}: EmailSubscriptionProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      setStatus('error');
      setMessage('Please enter a valid email address');
      return;
    }

    setStatus('loading');
    setMessage('');

    try {
      const response = await fetch('/api/daily-emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'add_subscriber',
          email: email,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setStatus('success');
        setMessage('Successfully subscribed! Check your email for confirmation.');
        setEmail('');
      } else {
        setStatus('error');
        setMessage(data.message || 'Failed to subscribe. Please try again.');
      }
    } catch (error) {
      setStatus('error');
      setMessage('Network error. Please try again.');
    }
  };

  return (
    <div className={`bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200 ${className}`}>
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          {title}
        </h3>
        <p className="text-gray-600 text-sm">
          {subtitle}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={status === 'loading'}
          />
        </div>

        <button
          type="submit"
          disabled={status === 'loading'}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-6 rounded-lg transition duration-200"
        >
          {status === 'loading' ? 'Subscribing...' : buttonText}
        </button>

        {message && (
          <div className={`text-sm p-3 rounded-lg ${
            status === 'success' 
              ? 'bg-green-100 text-green-700 border border-green-200' 
              : 'bg-red-100 text-red-700 border border-red-200'
          }`}>
            {message}
          </div>
        )}
      </form>

      <div className="mt-4 text-xs text-gray-500 text-center">
        <p>⚡ First applicants have a 13x better chance of getting hired!</p>
        <p>✨ Try our free CV writing tool to apply faster</p>
      </div>
    </div>
  );
} 