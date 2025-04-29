'use client'

import Link from 'next/link'

export default function HeadhunterCancel() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center max-w-2xl mx-auto px-4">
        <div className="text-gray-600 text-6xl mb-6">×</div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Payment Cancelled</h1>
        <p className="text-xl text-gray-600 mb-8">
          Your payment was cancelled. If you experienced any issues or have questions, please don&apos;t hesitate to contact us.
        </p>
        <div className="space-x-4">
          <Link
            href="/headhunter"
            className="inline-block bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </Link>
          <Link
            href="/contact"
            className="inline-block bg-gray-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
          >
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  )
}
