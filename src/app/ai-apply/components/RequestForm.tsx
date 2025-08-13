'use client'

import { useState } from 'react'

export default function RequestForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    cv: '',
    preferences: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Form submission is handled by PricingTable component
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  return (
    <section id="request-form" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Start Your AI Application Journey</h2>
          <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-lg shadow-sm">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your full name"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.email}
                onChange={handleChange}
                placeholder="your.email@example.com"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number *
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                required
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+32 123 456 789"
              />
            </div>

            <div>
              <label htmlFor="cv" className="block text-sm font-medium text-gray-700 mb-1">
                CV/Resume Link *
              </label>
              <input
                type="url"
                id="cv"
                name="cv"
                required
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.cv}
                onChange={handleChange}
                placeholder="https://drive.google.com/your-cv-link"
              />
              <p className="text-sm text-gray-500 mt-1">
                Please upload your CV to Google Drive, Dropbox, or similar and share the link
              </p>
            </div>

            <div>
              <label htmlFor="preferences" className="block text-sm font-medium text-gray-700 mb-1">
                Job Preferences & Requirements
              </label>
              <textarea
                id="preferences"
                name="preferences"
                rows={4}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.preferences}
                onChange={handleChange}
                placeholder="Tell us about your preferred roles, salary expectations, location preferences, and any specific requirements..."
              />
            </div>

            <div className="text-center">
              <a
                href="#pricing-section"
                className="bg-blue-600 text-white font-semibold px-8 py-4 rounded-lg text-lg hover:bg-blue-700 transition-colors"
              >
                Get Started with AI Applications
              </a>
            </div>
          </form>

          <div className="mt-12 text-center">
            <p className="text-gray-600 mb-4">Questions about the AI application service?</p>
            <a href="mailto:ceo@zatjob.com" className="text-blue-600 font-semibold hover:text-blue-700">
              Contact us: ceo@zatjob.com
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
