import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Menu, X, Instagram, Mail, Phone, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MainLayout = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isFloatingOpen, setIsFloatingOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Frame Collection', path: '/frames' },
    { name: 'Custom Configurator', path: '/configure' },
    { name: 'Our Services', path: '/services' },
    { name: 'FAQ', path: '/faq' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background text-primary font-body antialiased">
      {/* Header */}
      <header className={`fixed top-0 w-full z-50 transition-all duration-500 ${isScrolled ? 'bg-white/98 backdrop-blur-md shadow-card' : 'bg-white'}`}>
        
        {/* Top Row: Instagram | Logo | Phone */}
        <div className="border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
            {/* Left: Instagram */}
            <a
              href="https://www.instagram.com/craft_creators_original"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-primary/50 hover:text-accent transition-colors text-xs font-medium tracking-wide"
            >
              <Instagram size={16} />
              <span className="hidden sm:inline">@craft_creators_original</span>
            </a>

            {/* Center: Logo */}
            <Link to="/" className="flex items-center gap-2.5 group absolute left-1/2 -translate-x-1/2">
              <img src="/cc-logo.svg" alt="Craft Creator's" className="h-10 w-10 object-contain transition-transform duration-300 group-hover:scale-110 rounded-full" />
              <div className="text-center">
                <div className="text-lg md:text-xl font-display font-bold tracking-widest text-primary group-hover:text-accent transition-colors leading-tight">
                  CRAFT CREATOR'S
                </div>
                <div className="text-[8px] tracking-[0.25em] text-primary/40 font-medium uppercase">Premium Custom Framing</div>
              </div>
            </Link>

            {/* Right: Phone + Mobile Menu */}
            <div className="flex items-center gap-3">
              <a
                href="tel:+918077037277"
                className="hidden sm:flex items-center gap-1.5 text-primary/50 hover:text-accent transition-colors text-xs font-medium tracking-wide"
              >
                <Phone size={14} />
                +91 80770 37277
              </a>
              {/* Mobile hamburger */}
              <button
                className="lg:hidden text-primary hover:text-accent transition-colors"
                onClick={() => setMobileMenuOpen(true)}
              >
                <Menu size={22} />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Row: Nav links — desktop only */}
        <div className="hidden lg:block bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-6">
            <nav className="flex items-center justify-center gap-0">
              {navLinks.map(link => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`relative px-5 py-3.5 text-[11px] tracking-[0.15em] uppercase font-semibold transition-all duration-300 ${
                    location.pathname === link.path
                      ? 'text-accent'
                      : 'text-primary/60 hover:text-primary'
                  }`}
                >
                  {link.name}
                  {location.pathname === link.path && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className="absolute bottom-0 left-0 right-0 h-[2px] bg-accent rounded-full"
                    />
                  )}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-primary text-white flex flex-col justify-between p-8"
          >
            <div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <img src="/cc-logo.svg" alt="Craft Creator's" className="h-8 w-8 object-contain rounded-full" />
                  <span className="text-xl font-display font-bold tracking-widest text-accent">
                    CRAFT CREATOR'S
                  </span>
                </div>
                <button onClick={() => setMobileMenuOpen(false)} className="text-white/80 hover:text-white transition-colors">
                  <X size={28} />
                </button>
              </div>
              
              <nav className="flex flex-col gap-6 mt-16">
                {navLinks.map((link, idx) => (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.08 }}
                  >
                    <Link 
                      to={link.path}
                      className={`text-2xl font-display tracking-wide hover:text-accent transition-colors ${
                        location.pathname === link.path ? 'text-accent' : 'text-white/85'
                      }`}
                    >
                      {link.name}
                    </Link>
                  </motion.div>
                ))}
              </nav>
            </div>

            <div className="border-t border-white/10 pt-8 space-y-4">
              <p className="text-xs text-white/50 tracking-widest uppercase">Get In Touch</p>
              <p className="text-sm font-light text-white/80">+91 80770 37277</p>
              <p className="text-sm font-light text-white/80">hello@craftcreators.in</p>
              <div className="flex gap-4 text-white/60">
                <a 
                  href="https://www.instagram.com/craft_creators_original" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-accent transition-colors"
                >
                  <Instagram size={20} />
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 pt-24 lg:pt-28">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-primary text-white pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 text-center md:text-left">
          <div className="space-y-6">
            <div className="flex items-center gap-3 justify-center md:justify-start">
              <img src="/cc-logo.svg" alt="Craft Creator's" className="h-10 w-10 object-contain rounded-full" />
              <span className="font-display text-2xl text-accent font-bold tracking-widest">
                CRAFT CREATOR'S
              </span>
            </div>
            <p className="text-white/60 text-sm font-light leading-relaxed max-w-sm">
              We design and construct premium custom photo frames with gallery-quality materials. Bring your printed memories or upload them digitally for professional framing.
            </p>
            <div className="flex justify-center md:justify-start gap-4 text-white/60">
              <a 
                href="https://www.instagram.com/craft_creators_original" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-accent transition-colors"
              >
                <Instagram size={20} />
              </a>
            </div>
          </div>
          
          <div className="space-y-6">
            <h4 className="font-body text-xs font-semibold uppercase tracking-widest text-accent">Studio Links</h4>
            <ul className="space-y-3">
              <li><Link to="/frames" className="text-sm text-white/70 hover:text-accent transition-colors font-light">Frame Catalog</Link></li>
              <li><Link to="/configure" className="text-sm text-white/70 hover:text-accent transition-colors font-light">Custom Configurator</Link></li>
              <li><Link to="/services" className="text-sm text-white/70 hover:text-accent transition-colors font-light">Framing Services</Link></li>
              <li><Link to="/testimonials" className="text-sm text-white/70 hover:text-accent transition-colors font-light">Testimonials</Link></li>
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="font-body text-xs font-semibold uppercase tracking-widest text-accent">Contact Details</h4>
            <ul className="space-y-3 text-sm text-white/70 font-light">
              <li>Mumbai, Maharashtra, India</li>
              <li>hello@craftcreators.in</li>
              <li>+91 80770 37277</li>
              <li className="pt-2 text-xs text-white/40">Open: Mon - Sat (10 AM - 7 PM)</li>
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="font-body text-xs font-semibold uppercase tracking-widest text-accent">Legals</h4>
            <ul className="space-y-3">
              <li><Link to="/privacy" className="text-sm text-white/70 hover:text-accent transition-colors font-light">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-sm text-white/70 hover:text-accent transition-colors font-light">Terms & Conditions</Link></li>
              <li><Link to="/admin/login" className="text-sm text-white/30 hover:text-accent transition-colors font-light">Admin Access</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-white/40 font-body">
          <div>&copy; {new Date().getFullYear()} Craft Creator's. All Rights Reserved.</div>
          <div>Handcrafted in India.</div>
        </div>
      </footer>

      {/* Floating Contact Widget */}
      <div className="fixed bottom-6 right-6 z-[99] flex items-center transition-all duration-300">
        <div className={`flex flex-col gap-2 w-[180px] h-[96px] justify-between transition-all duration-500 ease-in-out ${
          isFloatingOpen ? 'opacity-100 translate-x-[20px] pointer-events-auto' : 'opacity-0 translate-x-[100px] pointer-events-none'
        }`}>
          <a 
            href="tel:+918077037277" 
            className="flex-1 flex items-center pl-4 bg-primary/95 backdrop-blur-md border border-accent/30 text-white rounded-t-xl shadow-luxury hover:bg-accent hover:text-primary transition-all duration-300"
          >
            <div className="bg-accent text-primary rounded-full h-7 w-7 flex items-center justify-center mr-3 shadow-sm">
              <Phone size={12} className="text-primary" />
            </div>
            <div className="font-body font-bold text-xs tracking-wider uppercase">Call Us</div>
          </a>

          <a 
            href="https://wa.me/918077037277" 
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center pl-4 bg-primary/95 backdrop-blur-md border border-accent/30 text-white rounded-b-xl shadow-luxury hover:bg-[#25D366] hover:border-[#25D366] transition-all duration-300"
          >
            <div className="bg-[#25D366] text-white rounded-full h-7 w-7 flex items-center justify-center mr-3 shadow-sm">
              <svg viewBox="0 0 32 32" fill="white" className="w-4 h-4">
                <path d="M16 0C7.163 0 0 7.163 0 16c0 2.822.737 5.469 2.027 7.769L0 32l8.469-2.013A15.938 15.938 0 0016 32c8.837 0 16-7.163 16-16S24.837 0 16 0zm0 29.333a13.27 13.27 0 01-6.771-1.854l-.485-.289-5.029 1.196 1.219-4.906-.317-.503A13.268 13.268 0 012.667 16C2.667 8.637 8.637 2.667 16 2.667S29.333 8.637 29.333 16 23.363 29.333 16 29.333zm7.28-9.907c-.397-.199-2.352-1.161-2.717-1.294-.364-.133-.63-.199-.895.199-.265.398-.996 1.294-1.221 1.56-.226.265-.451.298-.848.1-.397-.199-1.674-.617-3.19-1.967-1.178-1.05-1.975-2.35-2.207-2.747-.231-.398-.025-.613.174-.811.178-.178.397-.464.596-.696.199-.232.265-.398.397-.663.133-.265.066-.497-.033-.696-.099-.199-.895-2.156-1.228-2.951-.322-.775-.648-.669-.895-.681l-.762-.013c-.265 0-.696.099-1.061.497-.364.398-1.393 1.36-1.393 3.316s1.426 3.845 1.625 4.11c.199.265 2.808 4.287 6.803 6.012.952.411 1.694.657 2.274.841.955.303 1.824.26 2.511.158.766-.114 2.352-.961 2.684-1.89.332-.929.332-1.725.232-1.89-.099-.166-.364-.265-.762-.464z"/>
              </svg>
            </div>
            <div className="font-body font-bold text-xs tracking-wider uppercase">WhatsApp</div>
          </a>
        </div>

        <button 
          onClick={() => setIsFloatingOpen(!isFloatingOpen)}
          className="relative z-10 w-14 h-14 rounded-full border-2 border-accent bg-primary shadow-luxury cursor-pointer transition-all duration-500 ease-in-out hover:scale-105 mr-4 flex items-center justify-center text-2xl select-none"
        >
          👋
          <div className={`absolute -right-1 bottom-[14px] h-4 w-4 rounded-full bg-accent shadow-luxury flex items-center justify-center transition-all duration-300 ${
            isFloatingOpen ? 'opacity-0 scale-75' : 'opacity-100 scale-100'
          }`}>
            <Phone size={8} className="text-primary" />
          </div>

          <div className={`absolute -right-1 -top-1 h-5 w-5 rounded-full bg-accent shadow-luxury flex items-center justify-center transition-all duration-300 ${
            isFloatingOpen ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-75 rotate-90 pointer-events-none'
          }`}>
            <X size={10} className="text-primary" />
          </div>
        </button>
      </div>
    </div>
  );
};

export default MainLayout;
