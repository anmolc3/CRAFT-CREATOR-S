import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Instagram } from 'lucide-react';
import { WhatsAppIcon } from '../components/common/WhatsAppButton';

const ContactPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !message) return;

    const waText = `Hello Craft Creator's! 👋\n\nName: ${name}\nEmail: ${email || 'N/A'}\n\nMessage:\n${message}\n\nLooking forward to hearing from you!`;
    const waLink = `https://wa.me/918077037277?text=${encodeURIComponent(waText)}`;
    window.open(waLink, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-16 min-h-screen">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-accent text-[10px] tracking-[0.3em] font-semibold uppercase block">Reach Out</span>
        <h1 className="font-display text-3xl sm:text-5xl font-bold text-primary">Contact Our Studio</h1>
        <p className="text-primary/60 text-xs sm:text-sm font-light leading-relaxed">
          Have an inquiry about sizing, volume pricing, gallery collaborations, or need help with a custom frame order? Fill out the form and we'll open WhatsApp instantly.
        </p>
      </div>

      {/* Grid: Details (left) + Form (right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Left column: Contact Info */}
        <div className="lg:col-span-5 space-y-8 bg-primary text-white p-8 md:p-10 rounded-3xl shadow-luxury">
          <div className="border-b border-white/10 pb-4">
            <h3 className="font-display text-2xl font-bold">Studio Details</h3>
            <p className="text-white/40 text-xs font-light mt-1">Visit or call us directly.</p>
          </div>

          <div className="space-y-6 text-xs sm:text-sm font-light">
            <div className="flex gap-4 items-start">
              <MapPin className="text-accent shrink-0 mt-0.5" size={20} />
              <div>
                <span className="font-semibold block uppercase tracking-wider text-[10px] text-accent">Location Address</span>
                <span className="text-white/80 leading-relaxed block mt-1">
                  Craft Creator's Studio, Colaba, Mumbai, Maharashtra, India
                </span>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <Phone className="text-accent shrink-0 mt-0.5" size={20} />
              <div>
                <span className="font-semibold block uppercase tracking-wider text-[10px] text-accent">Call/WhatsApp</span>
                <span className="text-white/80 leading-relaxed block mt-1">+91 80770 37277</span>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <Mail className="text-accent shrink-0 mt-0.5" size={20} />
              <div>
                <span className="font-semibold block uppercase tracking-wider text-[10px] text-accent">Email Channel</span>
                <span className="text-white/80 leading-relaxed block mt-1">hello@craftcreators.in</span>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <Clock className="text-accent shrink-0 mt-0.5" size={20} />
              <div>
                <span className="font-semibold block uppercase tracking-wider text-[10px] text-accent">Opening Hours</span>
                <span className="text-white/80 leading-relaxed block mt-1">Mon - Sat: 10:00 AM - 7:00 PM</span>
                <span className="text-white/40 text-[10px] block font-light">Sundays: Studio closed</span>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-white/10 space-y-3">
            <span className="text-white/40 text-[10px] tracking-widest uppercase block font-semibold">Follow Our Work</span>
            <div className="flex gap-4 text-white/70">
              <a 
                href="https://www.instagram.com/craft_creators_original" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-accent transition-colors flex items-center gap-1.5 text-xs font-semibold tracking-wider"
              >
                <Instagram size={18} /> Instagram
              </a>
            </div>
          </div>
        </div>

        {/* Right column: Form */}
        <div className="lg:col-span-7 bg-white p-8 md:p-10 rounded-3xl border border-[#eaeaea] shadow-card space-y-6">
          <div className="border-b border-[#f5f5f5] pb-3">
            <h3 className="font-display text-xl font-bold text-primary">Send us a Message</h3>
            <p className="text-xs text-primary/40 mt-1 flex items-center gap-1.5">
              <WhatsAppIcon className="w-3.5 h-3.5 text-[#25D366]" />
              Submitting opens WhatsApp instantly with your message pre-filled.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] uppercase text-primary/40 tracking-widest font-semibold block">Full Name *</label>
              <input
                type="text"
                required
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-xs text-primary focus:outline-none focus:border-accent focus:bg-white transition-all"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase text-primary/40 tracking-widest font-semibold block">Email Address <span className="normal-case text-primary/30">(optional)</span></label>
              <input
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-xs text-primary focus:outline-none focus:border-accent focus:bg-white transition-all"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase text-primary/40 tracking-widest font-semibold block">Message Details *</label>
              <textarea
                required
                rows="4"
                placeholder="What can we help you with? Provide print sizing if applicable."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-xs text-primary focus:outline-none focus:border-accent focus:bg-white transition-all resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#25D366] hover:bg-[#20ba5a] text-white py-4 rounded-full text-xs font-semibold tracking-widest uppercase transition-all duration-300 shadow-luxury flex items-center justify-center gap-2"
            >
              <WhatsAppIcon className="w-4 h-4" /> Send via WhatsApp
            </button>
          </form>
        </div>

      </div>

    </div>
  );
};

export default ContactPage;
