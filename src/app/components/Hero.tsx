"use client";

import { useState } from "react";

declare global {
  interface Window {
    posthog?: { capture: (event: string, props?: Record<string, any>) => void };
  }
}

export default function Hero() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus('idle');
    setErrorMessage('');

    try {
      const response = await fetch('/api/newsletter/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to subscribe');
      }

      setStatus('success');
      setEmail('');
    } catch (error) {
      console.error('Error subscribing to newsletter:', error);
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Failed to subscribe');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="container my-4">
      <h1 className="text-2xl md:text-3xl font-bold text-center mb-4">
        Why go to 17 EU Jobsites? All EU jobs are here!
      </h1>

      <div className="max-w-4xl mx-auto">
        {/* Newsletter Signup Section */}
        <div className="w-full bg-white rounded-xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow mb-4">
          <h2 className="text-lg font-semibold mb-4 text-gray-800 text-center">
            Stay Updated with EU Jobs
          </h2>
          <p className="text-sm text-gray-600 text-center mb-6">
            Being fast to apply is key. The first 5% of applicants have a 13x chance of getting the job.
          </p>
          
          <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4">
            <div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                disabled={isSubmitting}
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !email}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
            >
              {isSubmitting ? 'Subscribing...' : 'Subscribe to Newsletter'}
            </button>

            {/* Status messages */}
            {status === 'success' && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-800 text-center">
                  ✅ Successfully subscribed! Welcome to our newsletter.
                </p>
              </div>
            )}

            {status === 'error' && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-800 text-center">
                  ❌ {errorMessage}
                </p>
              </div>
            )}
          </form>

          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-500 text-center">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
