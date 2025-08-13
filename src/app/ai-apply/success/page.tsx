import { Metadata } from 'next'
import AIApplySuccessClient from './AIApplySuccessClient'

export const metadata: Metadata = {
  title: 'AI Application Service - Payment Successful | EUjobs.co',
  description: 'Your AI application service payment was successful. We\'ll start processing your 100 applications within 7 days.',
}

export default function AIApplySuccessPage() {
  return <AIApplySuccessClient />
}
