const Contact = () => {
  const contactInfo = [
    {
      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />,
      icon2: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />,
      label: 'Address',
      value: '112 Azalea Hill',
      sub: 'Greenville, SC 29607-3886',
    },
    {
      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />,
      label: 'Phone',
      value: '866-736-0632',
      href: 'tel:866-736-0632',
    },
    {
      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />,
      label: 'Email',
      value: 'info@247fbs.com',
      href: 'mailto:info@247fbs.com',
    },
    {
      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />,
      label: 'Assistance Hours',
      value: '24/7 — Always Available',
    },
  ];

  return (
    <section id="contact" className="py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-20">
          <span className="inline-block text-secondary font-bold text-sm uppercase tracking-widest mb-3">Get In Touch</span>
          <h2 className="section-heading">
            Contact <span className="gradient-text">Us</span>
          </h2>
          <p className="section-subheading mt-4">
            Get in touch with our team for all your freight brokerage needs
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          {/* Contact Information */}
          <div className="lg:col-span-2 space-y-6">
            <div className="space-y-5">
              {contactInfo.map((item, index) => (
                <div key={index} className="group flex items-start p-4 rounded-xl hover:bg-background-alt transition-colors">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center text-primary group-hover:from-primary group-hover:to-primary-light group-hover:text-white transition-all duration-300">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {item.icon}
                      {item.icon2}
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-xs text-meta-color uppercase tracking-wider font-semibold mb-1">{item.label}</p>
                    {item.href ? (
                      <a href={item.href} className="font-semibold text-heading-color hover:text-primary transition-colors">
                        {item.value}
                      </a>
                    ) : (
                      <p className="font-semibold text-heading-color">{item.value}</p>
                    )}
                    {item.sub && <p className="text-sm text-foreground mt-0.5">{item.sub}</p>}
                  </div>
                </div>
              ))}
            </div>

            {/* Map placeholder */}
            <div className="rounded-2xl overflow-hidden bg-gradient-to-br from-primary/5 to-secondary/5 p-8 text-center border border-border-color">
              <svg className="w-12 h-12 text-primary/30 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              <p className="text-sm text-foreground">Greenville, South Carolina</p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-3">
            <div className="card p-8 md:p-10 border border-border-color">
              <h3 className="text-2xl font-extrabold mb-2 text-heading-color">Send Us a Message</h3>
              <p className="text-foreground text-sm mb-8">Fill out the form below and we'll get back to you within 24 hours.</p>

              <form className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="name" className="block text-xs font-bold uppercase tracking-wider text-foreground mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      className="w-full px-4 py-3 bg-background-alt border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-meta-color"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label htmlFor="c-email" className="block text-xs font-bold uppercase tracking-wider text-foreground mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      id="c-email"
                      className="w-full px-4 py-3 bg-background-alt border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-meta-color"
                      placeholder="you@company.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="phone" className="block text-xs font-bold uppercase tracking-wider text-foreground mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    className="w-full px-4 py-3 bg-background-alt border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-meta-color"
                    placeholder="(123) 456-7890"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-xs font-bold uppercase tracking-wider text-foreground mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={5}
                    className="w-full px-4 py-3 bg-background-alt border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none placeholder:text-meta-color"
                    placeholder="Tell us about your freight needs..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full btn-secondary text-base py-4 rounded-xl flex items-center justify-center gap-2 group"
                >
                  Send Message
                  <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;

