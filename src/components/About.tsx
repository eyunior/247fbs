const About = () => {
  const features = [
    {
      title: 'Technology',
      description: 'Cutting-edge logistics technology for seamless freight management and real-time visibility.',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      title: 'Shippers',
      description: 'Reliable transportation solutions connecting you with qualified carriers for your freight needs.',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
    },
    {
      title: 'Carriers',
      description: 'Access to quality freight opportunities with competitive rates and consistent loads.',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
        </svg>
      ),
    },
  ];

  return (
    <section id="about" className="py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-20">
          <span className="inline-block text-secondary font-bold text-sm uppercase tracking-widest mb-3">Who We Are</span>
          <h2 className="section-heading">
            About <span className="gradient-text">24/7 FBS</span>
          </h2>
          <p className="section-subheading mt-4">
            Freight brokerage services are third-party logistics intermediaries that connect
            shippers needing to move goods with authorized carriers, coordinating efficient
            and reliable transportation solutions.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <div
              key={index}
              id={feature.title.toLowerCase()}
              className="card group p-8 text-center border border-transparent hover:border-primary/10"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 text-primary mb-6 group-hover:from-primary group-hover:to-primary-light group-hover:text-white transition-all duration-500">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-3 text-heading-color group-hover:text-primary transition-colors">{feature.title}</h3>
              <p className="text-foreground leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* DOT & MC Card */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-primary to-primary-dark text-white p-10 md:p-12 shadow-card">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-secondary/10 rounded-full translate-y-1/2 -translate-x-1/2"></div>

          <div className="relative grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div>
              <span className="inline-block text-secondary-light font-bold text-sm uppercase tracking-widest mb-3">Fully Licensed</span>
              <h3 className="text-3xl font-extrabold mb-4 text-white">DOT & MC Information</h3>
              <p className="text-white/70 leading-relaxed text-lg">
                We are a fully licensed and authorized freight brokerage service committed
                to providing safe and compliant transportation solutions.
              </p>
            </div>
            <div className="space-y-4">
              <div className="bg-white/10 backdrop-blur-sm p-5 rounded-xl border border-white/10 hover:bg-white/15 transition-colors">
                <p className="text-xs text-white/50 uppercase tracking-wider mb-1">DOT Number</p>
                <p className="text-2xl font-extrabold tracking-wide">4513750</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm p-5 rounded-xl border border-white/10 hover:bg-white/15 transition-colors">
                <p className="text-xs text-white/50 uppercase tracking-wider mb-1">MC Number</p>
                <p className="text-2xl font-extrabold tracking-wide">MC-1787387-B</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;

