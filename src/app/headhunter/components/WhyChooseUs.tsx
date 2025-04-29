const benefits = [
  "Specialized in EU lobbying & public affairs",
  "Vetted candidates — not random CVs",
  "Faster and cheaper than traditional recruiters",
  "Transparent, success-based pricing",
  "30-day hire guarantee"
]

export default function WhyChooseUs() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose EUjobs.co?</h2>
          <div className="space-y-4">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="ml-3 text-lg text-gray-700">{benefit}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center text-gray-600">
            Trusted by 10+ organizations
          </div>
        </div>
      </div>
    </section>
  )
}
