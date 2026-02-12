const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary-dark to-[#0f2352] text-white min-h-[600px] flex items-center">
      {/* Animated background shapes */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-secondary/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary-light/20 rounded-full blur-3xl animate-float-delayed"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/5 rounded-full blur-3xl"></div>
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
        backgroundSize: '40px 40px'
      }}></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 w-full">
        <div className="text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-5 py-2 mb-8 animate-fade-in-down">
            <span className="w-2 h-2 bg-secondary rounded-full animate-pulse-soft"></span>
            <span className="text-sm font-medium text-white/90">Licensed & Bonded Freight Broker</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold mb-6 text-white leading-tight tracking-tight animate-fade-in-up">
            Innovative Tech Driving
            <br />
            <span className="bg-gradient-to-r from-white via-secondary-light to-secondary bg-clip-text text-transparent">
              Your Business Forward
            </span>
          </h1>

          <p className="text-lg md:text-xl mb-4 text-white/80 max-w-3xl mx-auto leading-relaxed animate-fade-in-up animate-delay-200">
            Freight Brokerage Systems delivers loads for thousands of clients,
            ranging from small businesses to Fortune 500 companies.
          </p>

          <p className="text-base mb-10 text-white/60 max-w-2xl mx-auto animate-fade-in-up animate-delay-300">
            24/7 availability • DOT No. 4513750 • MC-1787387-B
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up animate-delay-400">
            <a
              href="#contact"
              className="group relative bg-secondary text-white px-10 py-4 rounded-xl text-lg font-bold hover:bg-secondary-light transition-all duration-300 shadow-lg shadow-secondary/30 hover:shadow-xl hover:shadow-secondary/40 transform hover:-translate-y-1"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                Shippers
                <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </span>
            </a>
            <a
              href="#contact"
              className="group bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white px-10 py-4 rounded-xl text-lg font-bold hover:bg-white hover:text-primary transition-all duration-300 shadow-lg transform hover:-translate-y-1"
            >
              <span className="flex items-center justify-center gap-2">
                Carrier Set Up
                <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </span>
            </a>
          </div>

          {/* Trust indicators */}
          <div className="mt-16 flex flex-wrap justify-center gap-8 md:gap-12 animate-fade-in-up animate-delay-500">
            {[
              { value: '24/7', label: 'Support' },
              { value: '1000+', label: 'Carriers' },
              { value: '50+', label: 'States Covered' },
              { value: '99%', label: 'On-Time Rate' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-2xl md:text-3xl font-extrabold text-white">{stat.value}</p>
                <p className="text-xs md:text-sm text-white/50 mt-1 uppercase tracking-wider">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path d="M0 80L60 73.3C120 66.7 240 53.3 360 46.7C480 40 600 40 720 46.7C840 53.3 960 66.7 1080 70C1200 73.3 1320 66.7 1380 63.3L1440 60V80H1380C1320 80 1200 80 1080 80C960 80 840 80 720 80C600 80 480 80 360 80C240 80 120 80 60 80H0Z" fill="white"/>
        </svg>
      </div>
    </section>
  );
};

export default Hero;

