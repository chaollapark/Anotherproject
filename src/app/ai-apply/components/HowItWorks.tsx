const steps = [
  {
    title: "Share your profile",
    description: "Upload your CV and preferences",
    icon: "📄"
  },
  {
    title: "AI finds matches",
    description: "We identify high-fit roles for you",
    icon: "🤖"
  },
  {
    title: "You approve & send",
    description: "Review applications and tap approve",
    icon: "✅"
  },
  {
    title: "Track responses",
    description: "Monitor replies and follow-ups",
    icon: "📊"
  }
]

export default function HowItWorks() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">How AI Application Works</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
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
