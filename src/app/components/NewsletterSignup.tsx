"use client";
import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export default function NewsletterSignup() {
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  // Show newsletter after 3 seconds and only if not dismissed before
  useEffect(() => {
    const timer = setTimeout(() => {
      const dismissed = localStorage.getItem('newsletter-dismissed');
      if (!dismissed) {
        setIsVisible(true);
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    localStorage.setItem('newsletter-dismissed', 'true');
  };

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
      // Close after successful signup
      setTimeout(() => {
        handleClose();
      }, 2000);
    } catch (error) {
      console.error('Error subscribing to newsletter:', error);
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Failed to subscribe');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm w-full mx-4 md:mx-0 transition-all duration-300 ease-in-out">
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-4 md:p-6 relative">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close newsletter signup"
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Stay Updated with EU Jobs
          </h3>
          <p className="text-sm text-gray-600">
            Being fast to apply is key. The first 5% of applicants have a 13x chance of getting the job.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              required
              disabled={isSubmitting}
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !email}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
          >
            {isSubmitting ? 'Subscribing...' : 'Subscribe to Newsletter'}
          </button>
        </form>

        {/* Status messages */}
        {status === 'success' && (
          <div className="mt-3 p-2 bg-green-50 border border-green-200 rounded-md">
            <p className="text-sm text-green-800">
              ✅ Successfully subscribed! Welcome to our newsletter.
            </p>
          </div>
        )}

        {status === 'error' && (
          <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-800">
              ❌ {errorMessage}
            </p>
          </div>
        )}

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-gray-100">
          <p className="text-xs text-gray-500 text-center">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </div>
      </div>
    </div>
  );
}
