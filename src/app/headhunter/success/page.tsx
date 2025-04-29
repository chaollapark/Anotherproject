'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

export default function HeadhunterSuccess() {
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const sessionId = searchParams.get('session_id')

  useEffect(() => {
    async function verifySession() {
      try {
        if (!sessionId) {
          setError('No session ID found')
          setLoading(false)
          return
        }

        const response = await fetch('/api/verify-session', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ sessionId }),
        })

        if (!response.ok) {
          throw new Error('Payment verification failed')
        }

        // Get the session data
        const data = await response.json()
        
        // Update headhunter request status
        if (data.metadata?.headhunterId) {
          const updateResponse = await fetch('/api/headhunter/update-status', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              headhunterId: data.metadata.headhunterId,
              status: 'paid',
              email: data.metadata.email,
            }),
          })

          if (!updateResponse.ok) {
            console.error('Failed to update headhunter request status')
          }
        }

        setLoading(false)
      } catch (err: any) {
        setError(err.message)
        setLoading(false)
      }
    }

    verifySession()
  }, [sessionId])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying your payment...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Payment Verification Failed</h1>
          <p className="text-gray-600 mb-8">{error}</p>
          <Link
            href="/headhunter"
            className="inline-block bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center max-w-2xl mx-auto px-4">
        <div className="text-green-600 text-6xl mb-6">✓</div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Payment Successful!</h1>
        <p className="text-xl text-gray-600 mb-8">
          Thank you for choosing our headhunter service. Our team will contact you within 24 hours to start the recruitment process.
        </p>
        <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
          <h2 className="font-semibold text-gray-900 mb-2">What happens next?</h2>
          <ol className="text-left text-gray-600 space-y-2">
            <li>1. Our team will review your requirements</li>
            <li>2. We&apos;ll schedule an intake call to discuss details</li>
            <li>3. Start sourcing candidates within 24-48 hours</li>
            <li>4. Present the first batch of candidates within 7-10 days</li>
          </ol>
        </div>
        <Link
          href="/"
          className="inline-block bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Return to Homepage
        </Link>
      </div>
    </div>
  )
}
