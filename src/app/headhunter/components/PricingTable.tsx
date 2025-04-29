'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { loadStripe } from '@stripe/stripe-js'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

const plans = [
  {
    name: "Tier 1",
    tierId: "tier1",
    upfrontFee: "€200",
    successFee: "€1,800 on hire",
    notes: "Want to test our headhunter service?",
    features: ["Standard sourcing", "Pay on success", "10 top candidate guarantee"]
  },
  {
    name: "Tier 2",
    tierId: "tier2",
    upfrontFee: "€500",
    successFee: "€1,300 on hire",
    notes: "Priority sourcing",
    features: ["10% Discount", "Pay on success", "10 top candidate guarantee"]
  },
  {
    name: "Tier 3",
    tierId: "tier3",
    upfrontFee: "€1,500",
    successFee: "Flat",
    notes: "Unlimited hires",
    features: ["25% Discount", "10 top candidate guarantee"]
  }
]

export default function PricingTable() {
  const [loading, setLoading] = useState<string | null>(null)

  const handleCheckout = async (tier: string) => {
    try {
      setLoading(tier)
      
      // Get form data from the request form
      const formElement = document.querySelector('form') as HTMLFormElement
      if (!formElement) {
        alert('Please fill out the request form first')
        const requestForm = document.getElementById('request-form')
        requestForm?.scrollIntoView({ behavior: 'smooth' })
        setLoading(null)
        return
      }

      // Get input values directly
      const nameInput = formElement.querySelector('input[name="name"]') as HTMLInputElement
      const companyNameInput = formElement.querySelector('input[name="companyName"]') as HTMLInputElement
      const roleInput = formElement.querySelector('input[name="role"]') as HTMLInputElement
      const emailInput = formElement.querySelector('input[name="email"]') as HTMLInputElement
      const phoneInput = formElement.querySelector('input[name="phone"]') as HTMLInputElement
      const notesInput = formElement.querySelector('textarea[name="notes"]') as HTMLTextAreaElement

      const name = nameInput?.value
      const companyName = companyNameInput?.value
      const role = roleInput?.value
      const email = emailInput?.value
      const phone = phoneInput?.value
      const notes = notesInput?.value

      if (!name || !companyName || !role || !email || !phone) {
        alert('Please fill out all required fields in the request form first')
        const requestForm = document.getElementById('request-form')
        requestForm?.scrollIntoView({ behavior: 'smooth' })
        setLoading(null)
        return
      }

      // Create checkout session
      const response = await fetch('/api/create-headhunter-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tier,
          name,
          companyName,
          role,
          email,
          phone,
          notes
        }),
      })

      if (!response.ok) {
        throw new Error('Network response was not ok')
      }

      const { sessionId } = await response.json()

      // Redirect to Stripe checkout
      const stripe = await stripePromise
      if (!stripe) throw new Error('Stripe failed to initialize')

      const { error } = await stripe.redirectToCheckout({
        sessionId,
      })

      if (error) {
        throw error
      }
    } catch (err: any) {
      console.error('Error:', err)
      alert(err.message || 'Something went wrong')
    } finally {
      setLoading(null)
    }
  }

  return (
    <section id="pricing-section" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Transparent Pricing</h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <div key={plan.tierId} className="border rounded-lg p-8 hover:shadow-lg transition-shadow">
              <h3 className="text-2xl font-bold mb-4">{plan.name}</h3>
              <div className="mb-4">
                <div className="text-gray-600">Upfront Fee</div>
                <div className="text-3xl font-bold">{plan.upfrontFee}</div>
              </div>
              <div className="mb-4">
                <div className="text-gray-600">Success Fee</div>
                <div className="text-xl">{plan.successFee}</div>
              </div>
              <div className="text-sm text-gray-500 mb-6">{plan.notes}</div>
              <ul className="space-y-3">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center">
                    <svg className="h-5 w-5 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => handleCheckout(plan.tierId)}
                disabled={!!loading}
                className={`w-full text-center mt-8 bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                  loading === plan.tierId ? 'animate-pulse' : ''
                }`}
              >
                {loading === plan.tierId ? 'Processing...' : 'Get Started'}
              </button>
            </div>
          ))}
        </div>
        <p className="text-center text-gray-600 mt-8">
          You only pay the success fee if you hire. No hidden costs.
        </p>
      </div>
    </section>
  )
}
