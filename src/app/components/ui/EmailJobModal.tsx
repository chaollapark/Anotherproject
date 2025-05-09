'use client';

import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faEnvelope, faSpinner } from '@fortawesome/free-solid-svg-icons';

interface EmailJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobSlug: string;
  jobTitle: string;
}

export default function EmailJobModal({ isOpen, onClose, jobSlug, jobTitle }: EmailJobModalProps) {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus('idle');
    setErrorMessage('');

    try {
      const response = await fetch('/api/email/send-job', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, slug: jobSlug }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send job details');
      }

      setStatus('success');
    } catch (error) {
      console.error('Error sending job:', error);
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Failed to send job details');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 max-w-md w-full relative shadow-xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close modal"
        >
          <FontAwesomeIcon icon={faTimes} />
        </button>

        <div className="text-center mb-4">
          <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <FontAwesomeIcon icon={faEnvelope} className="text-blue-600 text-2xl" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800">
            Send job to your email
          </h3>
          <p className="text-gray-600 mt-1">
            Get the details for &ldquo;{jobTitle}&rdquo; sent to your inbox
          </p>
        </div>

        {status === 'success' ? (
          <div className="text-center">
            <div className="bg-green-100 p-4 rounded-lg mb-4">
              <p className="text-green-700 font-medium">Success! Job details have been sent to your email.</p>
            </div>
            <button
              onClick={onClose}
              className="bg-blue-600 text-white px-6 py-2 rounded-md font-medium hover:bg-blue-700 transition-colors"
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Your Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="you@example.com"
                required
              />
            </div>

            {status === 'error' && (
              <div className="bg-red-100 p-3 rounded-md mb-4">
                <p className="text-red-700 text-sm">{errorMessage}</p>
              </div>
            )}

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <FontAwesomeIcon icon={faSpinner} className="animate-spin mr-2" />
                    Sending...
                  </>
                ) : (
                  'Send to My Email'
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
