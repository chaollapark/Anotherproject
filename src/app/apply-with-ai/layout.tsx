import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Apply with AI — You Approve Every Application | EUjobs.co',
  description: 'We find high-fit roles, you tap Approve, we send from your email and track replies. 100 applications for €100 (7-day turnaround). On EUJobs & partner employers only.',
}

export default function ApplyWithAILayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}


