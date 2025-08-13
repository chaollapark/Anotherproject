const testimonials = [
  {
    name: "Maria K.",
    role: "Policy Analyst",
    company: "EU Institution",
    content: "The AI application service helped me land 3 interviews in just 2 weeks. The personalized applications were spot-on and I had full control over what was sent.",
    rating: 5
  },
  {
    name: "Thomas L.",
    role: "Public Affairs Manager",
    company: "Brussels-based NGO",
    content: "€100 for 100 applications is incredible value. The AI found roles I never would have discovered on my own. Highly recommended!",
    rating: 5
  },
  {
    name: "Sophie M.",
    role: "EU Affairs Consultant",
    company: "Consulting Firm",
    content: "The approval process gave me peace of mind. I could review each application before it went out, and the tracking system kept me organized.",
    rating: 5
  }
]

export default function Testimonials() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">What Our Users Say</h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-gray-50 p-6 rounded-lg">
              <div className="flex mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <svg key={i} className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-600 mb-4 italic">"{testimonial.content}"</p>
              <div>
                <div className="font-semibold text-gray-900">{testimonial.name}</div>
                <div className="text-sm text-gray-500">{testimonial.role} at {testimonial.company}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
