
'use client';

import { useState } from 'react';

interface NewsletterFormProps {
  onSuccessfulSubscription?: (isNewSubscription: boolean) => void;
}

export default function NewsletterForm({ onSuccessfulSubscription }: NewsletterFormProps) {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      setMessage(data.message);
      
      if (data.success) {
        setEmail('');
        // Call the callback to show success window (only for new subscriptions)
        if (onSuccessfulSubscription) {
          onSuccessfulSubscription(true);
        }
      } else {
        // For already subscribed users, don't show success window, just the message
        if (onSuccessfulSubscription && data.message.includes('already subscribed')) {
          onSuccessfulSubscription(false);
        }
      }
    } catch (error) {
      setMessage('Failed to subscribe. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md">
      <div className="flex items-center border-b border-teal-500 py-2">
        <input
          className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
          type="email"
          placeholder="jane.doe@example.com"
          aria-label="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={isSubmitting}
        />
        <button
          className="flex-shrink-0 bg-teal-500 hover:bg-teal-700 border-teal-500 hover:border-teal-700 text-sm border-4 text-white py-1 px-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Subscribing...' : 'Subscribe'}
        </button>
      </div>
      {message && (
        <p className={`text-sm mt-2 ${message.includes('Successfully') ? 'text-green-600' : 'text-blue-600'}`}>
          {message}
        </p>
      )}
    </form>
  );
}
