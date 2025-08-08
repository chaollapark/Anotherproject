// components/FloatingSignup.tsx
"use client";

import { useState, useEffect } from "react";

export default function FloatingSignup() {
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  // Show popup after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.success) {
        setShowSuccess(true);
        setEmail('');
        // Hide popup after 3 seconds
        setTimeout(() => {
          setVisible(false);
          setShowSuccess(false);
        }, 3000);
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      setMessage('Failed to subscribe. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 shadow-xl border border-gray-200 rounded-lg bg-white max-w-sm w-[320px]">
      <div className="relative p-4">
        <button
          onClick={() => setVisible(false)}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-lg font-bold transition-colors"
          aria-label="Close popup"
        >
          ✕
        </button>
        
        {showSuccess ? (
          <div className="text-center py-4">
            <div className="text-green-500 text-4xl mb-2">✓</div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Successfully Subscribed!
            </h3>
            <p className="text-sm text-gray-600">
              You'll receive our latest EU job opportunities in your inbox.
            </p>
          </div>
        ) : (
          <>
            <div className="text-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Stay Updated with EU Jobs
              </h3>
              <p className="text-sm text-gray-600">
                Get the latest EU job opportunities delivered to your inbox
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                  disabled={isSubmitting}
                />
              </div>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {isSubmitting ? 'Subscribing...' : 'Subscribe'}
              </button>
            </form>

            {message && (
              <p className={`text-sm mt-2 text-center ${
                message.includes('Successfully') || message.includes('already subscribed') 
                  ? 'text-green-600' 
                  : 'text-red-600'
              }`}>
                {message}
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
