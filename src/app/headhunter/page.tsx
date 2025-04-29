import { Metadata } from 'next'
import HeroSection from '@/app/headhunter/components/HeroSection'
import HowItWorks from '@/app/headhunter/components/HowItWorks'
import WhyChooseUs from '@/app/headhunter/components/WhyChooseUs'
import PricingTable from '@/app/headhunter/components/PricingTable'
import Testimonials from '@/app/headhunter/components/Testimonials'
import RequestForm from '@/app/headhunter/components/RequestForm'

export const metadata: Metadata = {
  title: 'Hire Lobbyists and Public Affairs Professionals — EUjobs.co Headhunting Service',
  description: 'Need to hire lobbyists or EU public affairs experts fast? EUjobs.co delivers vetted candidates in 30 days. Pay only if you hire.',
}

export default async function HeadhunterPage() {
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