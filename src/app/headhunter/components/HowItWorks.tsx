const steps = [
  {
    title: "Tell us what you need",
    description: "Quick 5-minute intake",
    icon: "📝"
  },
  {
    title: "Meet candidates fast",
    description: "Profiles delivered within 7–10 days",
    icon: "👥"
  },
  {
    title: "Hire only if happy",
    description: "Pay success fee after hiring",
    icon: "✅"
  }
]

export default function HowItWorks() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl mb-4">{step.icon}</div>
              <h3 className="text-xl font-semibold mb-2">Step {index + 1}: {step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
