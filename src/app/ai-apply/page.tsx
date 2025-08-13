import { Metadata } from 'next'
import HeroSection from '@/app/ai-apply/components/HeroSection'
import HowItWorks from '@/app/ai-apply/components/HowItWorks'
import WhyChooseUs from '@/app/ai-apply/components/WhyChooseUs'
import PricingTable from '@/app/ai-apply/components/PricingTable'
import Testimonials from '@/app/ai-apply/components/Testimonials'
import RequestForm from '@/app/ai-apply/components/RequestForm'

export const metadata: Metadata = {
  title: 'Apply with AI — You Approve Every Application | EUjobs.co',
  description: 'We find high-fit roles, you tap Approve, we send from your email and track replies. 100 applications for €100 (7-day turnaround). On EUJobs & partner employers only.',
}

export default async function AIApplyPage() {
  return (
    <main className="min-h-screen bg-white">
      <HeroSection />
      <HowItWorks />
      <WhyChooseUs />
      <PricingTable />
      <Testimonials />
      <RequestForm />
    </main>
  )
}
