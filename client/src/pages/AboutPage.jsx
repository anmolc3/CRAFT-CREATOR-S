import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Heart, Award, ArrowRight } from 'lucide-react';

const AboutPage = () => {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-20 min-h-screen">
      
      {/* Hero Banner Section */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <span className="text-accent text-[10px] tracking-[0.3em] font-semibold uppercase block">Who We Are</span>
          <h1 className="font-display text-3xl sm:text-5xl font-bold text-primary leading-tight">
            Crafting Premium Frames to Preserve Your Memories
          </h1>
          <p className="text-primary/75 text-xs sm:text-sm font-light leading-relaxed">
            Craft Creator's is a luxury custom photo framing studio dedicated to preserving your most cherished moments. Founded with a single passion — to treat every photograph, certification, or painting with museum-standard care.
          </p>
          <p className="text-primary/70 text-xs sm:text-sm font-light leading-relaxed">
            Unlike mass-produced store frames, we build each custom piece from raw hardwood and premium anodised metals. From hand-sanding joints to precision mat cutting, we ensure that every custom frame reflects top-tier gallery craftsmanship.
          </p>
          <div className="pt-4">
            <Link 
              to="/configure"
              className="bg-primary hover:bg-accent text-white hover:text-primary py-3.5 px-8 rounded-full text-xs font-semibold tracking-widest uppercase transition-all duration-300 shadow-luxury inline-flex items-center gap-2"
            >
              Start Custom Framing <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-luxury border border-[#eaeaea]">
          <img 
            src="https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800&q=80" 
            alt="Handcrafting frames in studio" 
            className="w-full h-full object-cover"
          />
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="bg-primary text-white p-10 md:p-16 rounded-3xl grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="space-y-3">
          <Award size={28} className="text-accent" />
          <h3 className="font-display text-lg font-bold">Uncompromising Quality</h3>
          <p className="text-white/60 text-xs font-light leading-relaxed">
            We use premium hardwood lumber, real conservation glass, and heavy mounting board. Every component is selected to last for generations.
          </p>
        </div>

        <div className="space-y-3">
          <Heart size={28} className="text-accent" />
          <h3 className="font-display text-lg font-bold">Personal Care</h3>
          <p className="text-white/60 text-xs font-light leading-relaxed">
            We understand that what goes inside the frame is irreplaceable. We handle your prints with white-glove respect from arrival to completion.
          </p>
        </div>

        <div className="space-y-3">
          <ShieldCheck size={28} className="text-accent" />
          <h3 className="font-display text-lg font-bold">In-house Printing</h3>
          <p className="text-white/60 text-xs font-light leading-relaxed">
            Upload your digital file and we will print it using high-definition archival inkjets on fine art paper before framing.
          </p>
        </div>
      </section>

      {/* History and Story Section */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="order-2 lg:order-1 relative aspect-[4/3] rounded-3xl overflow-hidden shadow-luxury border border-[#eaeaea]">
          <img 
            src="https://images.unsplash.com/photo-1541123437800-1bb1317badc2?w=800&q=80" 
            alt="Custom frames on wall display" 
            className="w-full h-full object-cover"
          />
        </div>

        <div className="space-y-6 order-1 lg:order-2">
          <span className="text-accent text-[10px] tracking-[0.3em] font-semibold uppercase block">Our Heritage</span>
          <h2 className="font-display text-2xl sm:text-4xl font-bold text-primary">The Studio Craft</h2>
          <p className="text-primary/75 text-xs sm:text-sm font-light leading-relaxed">
            Born out of a small artisan woodshop in Mumbai, India, Craft Creator's has grown into one of the country's most respected custom framing studios.
          </p>
          <p className="text-primary/70 text-xs sm:text-sm font-light leading-relaxed">
            We work closely with fine artists, wedding photographers, interior designers, and proud homeowners to frame original drawings, vintage poster designs, and professional credentials.
          </p>
          <p className="text-primary/70 text-xs sm:text-sm font-light leading-relaxed">
            Our goal remains simple: to capture your memories and elevate them into beautifully presented pieces of art that enrich your walls.
          </p>
        </div>
      </section>

    </div>
  );
};

export default AboutPage;
