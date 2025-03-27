'use client'

import { usePathname, useSearchParams } from "next/navigation"
import { useEffect, Suspense } from "react"
import { usePostHog } from 'posthog-js/react'

import posthog from 'posthog-js'
import { PostHogProvider as PHProvider } from 'posthog-js/react'

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY as string, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com',
      person_profiles: 'identified_only',
      capture_pageview: false
    })
  }, [])

  return (
    <PHProvider client={posthog}>
      <SuspendedPostHogPageView />
      {children}
    </PHProvider>
  )
}

function PostHogPageView() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const posthog = usePostHog()

  // 🧠 Store UTM params once per session
  useEffect(() => {
    const stored = window.sessionStorage.getItem('utm_registered')

    if (!stored && searchParams) {
      const utmKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content']
      const utmParams: Record<string, string> = {}

      utmKeys.forEach(key => {
        const value = searchParams.get(key)
        if (value) {
          utmParams[key] = value
        }
      })

      if (Object.keys(utmParams).length > 0) {
        posthog.register(utmParams)
        window.sessionStorage.setItem('utm_registered', 'true') // Don't re-register on every page
      }
    }
  }, [searchParams, posthog])

  // 📈 Track pageviews
  useEffect(() => {
    if (pathname && posthog) {
      let url = window.origin + pathname
      if (searchParams.toString()) {
        url += '?' + searchParams.toString()
      }
  
      // Normalize the pathname
      let normalizedPath = pathname
      if (pathname.startsWith('/job/')) {
        normalizedPath = '/job/[slug]'
      }
  
      posthog.capture('$pageview', {
        '$current_url': url,
        '$pathname': normalizedPath,
        page_group: 'job_detail'
      })
    }
  }, [pathname, searchParams, posthog])

  return null
}

// Suspense wrapper to avoid client rendering issues with useSearchParams
function SuspendedPostHogPageView() {
  return (
    <Suspense fallback={null}>
      <PostHogPageView />
    </Suspense>
  )
}
