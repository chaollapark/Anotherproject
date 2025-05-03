import { default as NextDynamic } from 'next/dynamic'
import { Suspense } from 'react'

// Use dynamic import with no SSR to fix the build issue
const HeadhunterSuccessClient = NextDynamic(
  () => import('./HeadhunterSuccessClient'),
  { ssr: false }
)

// Make sure this page is not statically generated
export const dynamic = 'force-dynamic'

export default function HeadhunterSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading payment verification...</p>
        </div>
      </div>
    }>
      <HeadhunterSuccessClient />
    </Suspense>
  )
}
