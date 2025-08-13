'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'

export default function AIApplySuccessClient() {
  const searchParams = useSearchParams()
  const [sessionId, setSessionId] = useState<string | null>(null)

  useEffect(() => {
    const sessionIdParam = searchParams.get('session_id')
    setSessionId(sessionIdParam)
  }, [searchParams])

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
      <div className="max-w-2xl mx-auto text-center p-8">
        <div className="mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Payment Successful!
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Your AI Application Service has been activated
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold mb-6">What Happens Next?</h2>
          <div className="space-y-4 text-left">
            <div className="flex items-start">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-1">
                <span className="text-blue-600 text-sm font-semibold">1</span>
              </div>
              <div>
                <h3 className="font-semibold">We&apos;ll review your CV and preferences</h3>
                <p className="text-gray-600">Our team will analyze your profile to understand your career goals</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-1">
                <span className="text-blue-600 text-sm font-semibold">2</span>
              </div>
              <div>
                <h3 className="font-semibold">AI will find matching roles</h3>
                <p className="text-gray-600">Our AI will identify 100 high-fit positions from EU institutions and partner employers</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-1">
                <span className="text-blue-600 text-sm font-semibold">3</span>
              </div>
              <div>
                <h3 className="font-semibold">You&apos;ll receive applications for approval</h3>
                <p className="text-gray-600">We&apos;ll send you personalized applications to review and approve before sending</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-1">
                <span className="text-blue-600 text-sm font-semibold">4</span>
              </div>
              <div>
                <h3 className="font-semibold">Track responses and follow-ups</h3>
                <p className="text-gray-600">Monitor all responses and we&apos;ll handle follow-ups on your behalf</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold mb-2">Timeline</h3>
          <p className="text-gray-600">
            <strong>7-day turnaround:</strong> You&apos;ll receive your first batch of applications within 7 days
          </p>
        </div>

        <div className="space-y-4">
          <a
            href="/"
            className="inline-block bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Return to Homepage
          </a>
          <div>
            <p className="text-gray-600 mb-2">Questions about your order?</p>
            <a href="mailto:ceo@zatjob.com" className="text-blue-600 font-semibold hover:text-blue-700">
              Contact us: ceo@zatjob.com
            </a>
          </div>
        </div>

        {sessionId && (
          <div className="mt-8 text-sm text-gray-500">
            Session ID: {sessionId}
          </div>
        )}
      </div>
    </div>
  )
}
