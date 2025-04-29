const testimonials = [
  {
    quote: "EUjobs.co helped us hire a Policy Officer in just 3 weeks — far faster and cheaper than any traditional recruiter.",
    author: "Public Affairs Director",
    company: "Brussels"
  }
]

export default function Testimonials() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">What Our Clients Say</h2>
        <div className="max-w-4xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white rounded-lg p-8 shadow-sm">
              <div className="text-4xl text-gray-300 mb-4">&quot;We didn&apos;t even set up the interview. We talked to 20 candidates and then hired&quot;</div>
              <blockquote className="text-xl text-gray-700 mb-6">
                {testimonial.quote}
              </blockquote>
              <div className="font-semibold">{testimonial.author}</div>
              <div className="text-gray-600">{testimonial.company}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
