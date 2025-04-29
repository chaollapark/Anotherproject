const HeroSection = () => {
  return (
    <section className="relative bg-blue-50 py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Hire Lobbyists and Public Affairs Experts — Fast and Risk-Free
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8">
            We deliver pre-vetted candidates in 30 days or less. Pay only if you hire.
          </p>
          <a
            href="#request-form"
            className="inline-block bg-blue-600 text-white font-semibold px-8 py-4 rounded-lg text-lg hover:bg-blue-700 transition-colors"
          >
            Request Candidates
          </a>
        </div>
      </div>
    </section>
  )
}

export default HeroSection;
