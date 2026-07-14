import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Menu, X, Instagram, Mail, Phone } from 'lucide-react';
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
    { name: 'Portfolio', path: '/' },
    { name: 'Favorites', path: '/favorites' },
    { name: 'Services', path: '/services' },
    { name: 'Book Session', path: '/book' },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header 
        className={`fixed top-0 w-full z-50 transition-all duration-500 ${
          isScrolled 
            ? 'bg-white/90 backdrop-blur-md shadow-sm py-4' 
            : 'bg-transparent py-6'
        }`}
      >
        <div className="container-luxury flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 text-2xl font-display font-medium tracking-wide text-primary">
            <img src="/cc-logo.svg" alt="Craft Creator's Logo" className="h-10 w-10 md:h-12 md:w-12 object-contain rounded-full shadow-sm" />
            <span>CRAFT CREATOR'S</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map(link => (
              <Link 
                key={link.name} 
                to={link.path}
                className={`nav-link ${location.pathname === link.path ? 'active' : ''}`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden text-primary"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu size={24} />
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-primary text-white flex flex-col"
          >
            <div className="p-6 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <img src="/cc-logo.svg" alt="Craft Creator's Logo" className="h-8 w-8 object-contain rounded-full" />
                <span className="text-xl font-display tracking-wide">CRAFT CREATOR'S</span>
              </div>
              <button onClick={() => setMobileMenuOpen(false)} className="text-white/80 hover:text-white">
                <X size={28} />
              </button>
            </div>
            
            <nav className="flex-1 flex flex-col items-center justify-center gap-8">
              {navLinks.map((link, idx) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <Link 
                    to={link.path}
                    className="text-3xl font-display tracking-wide hover:text-accent transition-colors"
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-primary text-white py-16">
        <div className="container-luxury grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
          <div>
            <div className="flex items-center gap-3 justify-center md:justify-start mb-4">
              <img src="/cc-logo.svg" alt="Craft Creator's Logo" className="h-10 w-10 object-contain rounded-full" />
              <span className="font-display text-2xl text-white tracking-wide">Craft Creator's</span>
            </div>
            <p className="text-white/60 text-sm font-light leading-relaxed mb-6 max-w-xs mx-auto md:mx-0">
              Capturing light, crafting moments. Fine art prints and editorial photography for discerning clients worldwide.
            </p>
            <div className="flex items-center justify-center md:justify-start gap-4 text-white/60">
              <a 
                href="https://www.instagram.com/craft_creators_original?utm_source=qr&igsh=MTJubGxraXB3d3FqOA==" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-accent transition-colors"
              >
                <Instagram size={20} />
              </a>
              <a href="#" className="hover:text-accent transition-colors"><Mail size={20} /></a>
            </div>
          </div>
          
          <div>
            <h4 className="font-body text-xs font-medium uppercase tracking-widest text-white/40 mb-6">Explore</h4>
            <ul className="space-y-4">
              <li><Link to="/services" className="text-sm text-white/80 hover:text-accent transition-colors">Services</Link></li>
              <li><Link to="/book" className="text-sm text-white/80 hover:text-accent transition-colors">Inquire & Book</Link></li>
              <li><Link to="/admin/login" className="text-sm text-white/40 hover:text-white transition-colors">Client/Admin Portal</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-body text-xs font-medium uppercase tracking-widest text-white/40 mb-6">Contact</h4>
            <ul className="space-y-4 text-sm text-white/80">
              <li>Mumbai, Maharashtra, India</li>
              <li>hello@sikhar.photography</li>
              <li>+91 80770 37277</li>
            </ul>
          </div>
        </div>
        <div className="container-luxury mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-white/40 font-body">
          <div>&copy; {new Date().getFullYear()} Craft Creator's. All Rights Reserved.</div>
          <div>Made by Anmol Chaudhary</div>
        </div>
      </footer>

      {/* Floating Contact Widget */}
      <div className="fixed bottom-6 right-6 z-[99] flex items-center transition-all duration-300">
        
        {/* Expanded buttons panel */}
        <div className={`flex flex-col gap-2 w-[180px] h-[96px] justify-between transition-all duration-500 ease-in-out ${
          isFloatingOpen ? 'opacity-100 translate-x-[20px] pointer-events-auto' : 'opacity-0 translate-x-[100px] pointer-events-none'
        }`}>
          {/* Call button */}
          <a 
            href="tel:+918077037277" 
            className="flex-1 flex items-center pl-4 bg-[#111111]/95 backdrop-blur-md border border-[#D4AF37]/30 text-white rounded-t-xl shadow-luxury hover:bg-[#D4AF37] hover:text-[#111] transition-all duration-300"
          >
            <div className="bg-[#D4AF37] text-primary rounded-full h-7 w-7 flex items-center justify-center mr-3 shadow-sm">
              <Phone size={12} className="text-[#111]" />
            </div>
            <div className="font-body font-bold text-xs tracking-wider uppercase">Call Us</div>
          </a>

          {/* Email button */}
          <a 
            href="mailto:hello@sikhar.photography" 
            className="flex-1 flex items-center pl-4 bg-[#111111]/95 backdrop-blur-md border border-[#D4AF37]/30 text-white rounded-b-xl shadow-luxury hover:bg-[#D4AF37] hover:text-[#111] transition-all duration-300"
          >
            <div className="bg-[#D4AF37] text-primary rounded-full h-7 w-7 flex items-center justify-center mr-3 shadow-sm">
              <Mail size={12} className="text-[#111]" />
            </div>
            <div className="font-body font-bold text-xs tracking-wider uppercase">Email Us</div>
          </a>
        </div>

        {/* Circular Avatar Trigger */}
        <button 
          onClick={() => setIsFloatingOpen(!isFloatingOpen)}
          className="relative z-10 w-16 h-16 rounded-full border-2 border-[#D4AF37] bg-[#111111] shadow-luxury cursor-pointer transition-all duration-500 ease-in-out hover:scale-105 mr-4 flex items-center justify-center text-3xl select-none"
        >
          🙋🏻‍♂️
          {/* Phone Badge (hidden when open) */}
          <div className={`absolute -right-1 bottom-[18px] h-5 w-5 rounded-full bg-[#D4AF37] shadow-luxury flex items-center justify-center transition-all duration-300 ${
            isFloatingOpen ? 'opacity-0 scale-75' : 'opacity-100 scale-100'
          }`}>
            <Phone size={10} className="text-[#111]" />
          </div>

          {/* Mail Badge (hidden when open) */}
          <div className={`absolute right-0 -bottom-1 h-7 w-7 rounded-full bg-[#D4AF37] shadow-luxury flex items-center justify-center transition-all duration-300 ${
            isFloatingOpen ? 'opacity-0 scale-75' : 'opacity-100 scale-100'
          }`}>
            <Mail size={14} className="text-[#111]" />
          </div>

          {/* Close Badge (visible when open) */}
          <div className={`absolute -right-1 -top-1 h-5 w-5 rounded-full bg-[#D4AF37] shadow-luxury flex items-center justify-center transition-all duration-300 ${
            isFloatingOpen ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-75 rotate-90 pointer-events-none'
          }`}>
            <X size={12} className="text-[#111]" />
          </div>
        </button>

      </div>
    </div>
  );
};

export default MainLayout;
