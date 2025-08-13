'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { loadStripe } from '@stripe/stripe-js'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

const plans = [
  {
    name: "AI Application Package",
    price: "€100",
    applications: "100 applications",
    turnaround: "7-day turnaround",
    features: [
      "AI-powered job matching",
      "Personalized applications",
      "You approve every application",
      "Track responses & follow-ups",
      "EU Jobs & partner employers only",
      "Email support"
    ]
  }
]

export default function PricingTable() {
  const [loading, setLoading] = useState(false)

  const handleCheckout = async () => {
    try {
      setLoading(true)
      
      // Get form data from the request form
      const formElement = document.querySelector('form') as HTMLFormElement
      if (!formElement) {
        alert('Please fill out the request form first')
        const requestForm = document.getElementById('request-form')
        requestForm?.scrollIntoView({ behavior: 'smooth' })
        setLoading(false)
        return
      }

      // Get input values directly
      const nameInput = formElement.querySelector('input[name="name"]') as HTMLInputElement
      const emailInput = formElement.querySelector('input[name="email"]') as HTMLInputElement
      const phoneInput = formElement.querySelector('input[name="phone"]') as HTMLInputElement
      const cvInput = formElement.querySelector('input[name="cv"]') as HTMLInputElement
      const preferencesInput = formElement.querySelector('textarea[name="preferences"]') as HTMLTextAreaElement

      const name = nameInput?.value
      const email = emailInput?.value
      const phone = phoneInput?.value
      const cv = cvInput?.value
      const preferences = preferencesInput?.value

      if (!name || !email || !phone || !cv) {
        alert('Please fill out all required fields in the request form first')
        const requestForm = document.getElementById('request-form')
        requestForm?.scrollIntoView({ behavior: 'smooth' })
        setLoading(false)
        return
      }

      // Create checkout session
      const response = await fetch('/api/create-ai-apply-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          phone,
          cv,
          preferences
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
      setLoading(false)
    }
  }

  return (
    <section id="pricing-section" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Simple, Transparent Pricing</h2>
        <div className="max-w-2xl mx-auto">
          {plans.map((plan) => (
            <div key={plan.name} className="border rounded-lg p-8 hover:shadow-lg transition-shadow bg-gradient-to-br from-blue-50 to-indigo-50">
              <h3 className="text-3xl font-bold mb-4 text-center">{plan.name}</h3>
              <div className="text-center mb-6">
                <div className="text-5xl font-bold text-blue-600 mb-2">{plan.price}</div>
                <div className="text-xl text-gray-600 mb-1">{plan.applications}</div>
                <div className="text-lg text-gray-500">{plan.turnaround}</div>
              </div>
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center">
                    <svg className="h-5 w-5 text-blue-600 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
              <button
                onClick={handleCheckout}
                disabled={loading}
                className={`w-full text-center bg-blue-600 text-white font-semibold px-6 py-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-lg ${
                  loading ? 'animate-pulse' : ''
                }`}
              >
                {loading ? 'Processing...' : 'Get Started Now'}
              </button>
            </div>
          ))}
        </div>
        <p className="text-center text-gray-600 mt-8">
          No hidden fees. No surprises. Just results.
        </p>
      </div>
    </section>
  )
}
