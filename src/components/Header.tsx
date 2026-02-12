import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, signOut } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    setIsMenuOpen(false);
  };

  const navLinks = [
    { href: '#about', label: 'About' },
    { href: '#technology', label: 'Technology' },
    { href: '#shippers', label: 'Shippers' },
    { href: '#carriers', label: 'Carriers' },
    { href: '#services', label: 'Services' },
    { href: '#contact', label: 'Contact' },
  ];

  return (
    <>
      {/* Top Info Bar */}
      <div className="bg-primary text-white text-sm hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center py-2">
          <div className="flex items-center space-x-6">
            <span className="flex items-center gap-1.5 opacity-90">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
              <a href="tel:866-736-0632" className="hover:text-secondary-light transition-colors">866-736-0632</a>
            </span>
            <span className="flex items-center gap-1.5 opacity-90">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              <a href="mailto:info@247fbs.com" className="hover:text-secondary-light transition-colors">info@247fbs.com</a>
            </span>
          </div>
          <div className="flex items-center space-x-4 opacity-90">
            <span className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              24/7 Available
            </span>
            <span className="text-white/40">|</span>
            <span>DOT: 4513750</span>
            <span className="text-white/40">|</span>
            <span>MC-1787387-B</span>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'glass shadow-soft' : 'bg-white shadow-md'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-3">
            {/* Logo */}
            <Link to="/" className="flex items-center group">
              <span className="text-3xl font-extrabold tracking-tight">
                <span className="text-primary group-hover:text-primary-light transition-colors">24/7</span>
                <span className="text-secondary group-hover:text-secondary-light transition-colors ml-1">FBS</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="relative px-4 py-2 text-sm font-medium text-foreground hover:text-primary transition-colors group"
                >
                  {link.label}
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-secondary rounded-full transition-all duration-300 group-hover:w-3/4"></span>
                </a>
              ))}
            </nav>

            {/* CTA Buttons */}
            <div className="hidden lg:flex items-center space-x-3">
              <a
                href="tel:866-736-0632"
                className="btn-secondary text-sm px-5 py-2.5 flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                866-736-0632
              </a>
              {user ? (
                <>
                  <Link to="/dashboard" className="btn-primary text-sm px-5 py-2.5">
                    Dashboard
                  </Link>
                  <button onClick={handleSignOut} className="btn-outline text-sm px-5 py-2">
                    Sign Out
                  </button>
                </>
              ) : (
                <Link to="/login" className="btn-primary text-sm px-5 py-2.5">
                  Login
                </Link>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              className="lg:hidden text-foreground p-2 rounded-lg hover:bg-background-alt transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <svg className="w-6 h-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? <path d="M6 18L18 6M6 6l12 12" /> : <path d="M4 6h16M4 12h16M4 18h16" />}
              </svg>
            </button>
          </div>

          {/* Mobile Navigation */}
          <div className={`lg:hidden overflow-hidden transition-all duration-300 ${isMenuOpen ? 'max-h-[500px] opacity-100 pb-6' : 'max-h-0 opacity-0'}`}>
            <nav className="space-y-1 border-t border-border-color pt-4">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="block py-2.5 px-3 rounded-lg text-foreground hover:text-primary hover:bg-background-alt transition-all font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <div className="pt-3 space-y-2">
                <a href="tel:866-736-0632" className="block btn-secondary text-center text-sm py-2.5">
                  866-736-0632
                </a>
                {user ? (
                  <>
                    <Link to="/dashboard" className="block btn-primary text-center text-sm py-2.5" onClick={() => setIsMenuOpen(false)}>
                      Dashboard
                    </Link>
                    <button onClick={handleSignOut} className="block w-full btn-outline text-center text-sm py-2.5">
                      Sign Out
                    </button>
                  </>
                ) : (
                  <Link to="/login" className="block btn-primary text-center text-sm py-2.5" onClick={() => setIsMenuOpen(false)}>
                    Login
                  </Link>
                )}
              </div>
            </nav>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;

