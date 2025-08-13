const benefits = [
  {
    title: "You're in Control",
    description: "Review and approve every application before it's sent. No surprises.",
    icon: "🎯"
  },
  {
    title: "AI-Powered Matching",
    description: "Advanced algorithms find roles that match your skills and experience perfectly.",
    icon: "🤖"
  },
  {
    title: "Fast Turnaround",
    description: "100 applications delivered in 7 days. Get noticed quickly.",
    icon: "⚡"
  },
  {
    title: "Track Everything",
    description: "Monitor responses, follow-ups, and interview requests in real-time.",
    icon: "📈"
  },
  {
    title: "EU Jobs Focus",
    description: "Specialized in European Union institutions and partner employers only.",
    icon: "🇪🇺"
  },
  {
    title: "Affordable Pricing",
    description: "€100 for 100 applications. That's just €1 per application.",
    icon: "💰"
  }
]

export default function WhyChooseUs() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Why Choose AI Application Service?</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {benefits.map((benefit, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="text-3xl mb-4">{benefit.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
              <p className="text-gray-600">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
