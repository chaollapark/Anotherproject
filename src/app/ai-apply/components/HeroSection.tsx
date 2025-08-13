const HeroSection = () => {
  return (
    <section className="relative bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Apply with AI — You Approve Every Application
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8">
            Being the first 5% of applicant raises your chances by 13times.
            100 applications for €100 (7-day turnaround).
          </p>
          <a
            href="#request-form"
            className="inline-block bg-blue-600 text-white font-semibold px-8 py-4 rounded-lg text-lg hover:bg-blue-700 transition-colors"
          >
            Start AI Application Service
          </a>
        </div>
      </div>
    </section>
  )
}

export default HeroSection;
