'use client';
import { useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { updateJobStatusAfterPayment } from '@/app/actions/jobActions';
import posthog from 'posthog-js';

// Create a separate component for the success content
function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    
    if (sessionId) {
      fetch('/api/verify-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sessionId }),
      })
      .then(response => response.json())
      .then(data => {
        if (data.jobId && data.plan) {
          updateJobStatusAfterPayment(data.jobId, data.plan);
          // Extract UTM parameters
          const params = new URLSearchParams(window.location.search);
          const utm_source = params.get('utm_source');
          const utm_medium = params.get('utm_medium');
          const utm_campaign = params.get('utm_campaign');

          // ✅ PostHog Event Tracking
          posthog.capture('payment_success', {
            jobId: data.jobId,
            plan: data.plan,
            utm_source,
            utm_medium,
            utm_campaign,

          });
          
          // Trigger Google Analytics event
          if (typeof window !== 'undefined' && window.gtag) {
            window.gtag('event', 'ads_conversion_Success_Page_1', {
              jobId: data.jobId,
              plan: data.plan,
            });
          }
        }
      })
      .catch(error => console.error('Error:', error));
    }

    const redirectTimeout = setTimeout(() => {
      router.push('/');
    }, 5000);

    return () => clearTimeout(redirectTimeout);
  }, [searchParams, router]);

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      backgroundColor: '#f0f8ff'
    }}>
      <div style={{
        border: '2px solid #28a745',
        backgroundColor: '#d4edda',
        padding: '30px',
        borderRadius: '20px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        maxWidth: '500px',
        textAlign: 'center'
      }}>
        <h1 style={{
          color: '#28a745',
          marginBottom: '20px',
          fontSize: '2.5rem'
        }}>Payment Successful!</h1>
        <p style={{
          fontSize: '1.2rem',
          lineHeight: '1.6',
          color: '#333'
        }}>
          Your job posting has been successfully published. Thank you for choosing our platform!
        </p>
        <p style={{
          fontSize: '1rem',
          marginTop: '20px',
          color: '#666'
        }}>
          You will be redirected to the home page in 5 seconds...
        </p>
      </div>
    </div>
  );
}

// Loading component
function LoadingContent() {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      backgroundColor: '#f0f8ff'
    }}>
      <div>Loading...</div>
    </div>
  );
}

// Main component with Suspense
export default function JobSuccessPage() {
  return (
    <Suspense fallback={<LoadingContent />}>
      <SuccessContent />
    </Suspense>
  );
}
