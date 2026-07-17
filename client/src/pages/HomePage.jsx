import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Star, ShieldCheck, HelpCircle, PhoneCall, Truck, Paintbrush, Sliders } from 'lucide-react';
import { frameService } from '../services/frameService';
import { serviceService } from '../services/serviceService';
import { testimonialService } from '../services/testimonialService';
import { FrameSkeleton } from '../components/common/SkeletonLoader';
import { WhatsAppIcon } from '../components/common/WhatsAppButton';
import { StarRating } from '../components/common/StarRating';

const MotionLink = motion(Link);

const HomePage = () => {
  const [featuredFrames, setFeaturedFrames] = useState([]);
  const [services, setServices] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [framesRes, servicesRes, testRes] = await Promise.all([
          frameService.getFrames({ featured: 'true', limit: 4 }),
          serviceService.getServices(),
          testimonialService.getTestimonials(),
        ]);
        setFeaturedFrames(framesRes.data.data || []);
        setServices(servicesRes.data.data || []);
        setTestimonials(testRes.data.data?.filter(t => t.featured).slice(0, 3) || []);
      } catch (err) {
        console.error('Error fetching homepage data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setNewsletterSubscribed(true);
      setEmail('');
    }
  };

  return (
    <div className="space-y-24 pb-20">
      
      {/* ── Luxury Hero Section ── */}
      <section className="relative h-[90vh] min-h-[600px] flex items-center justify-center overflow-hidden bg-primary text-white">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=1600&q=80"
            alt="Custom Framed Art on Wall"
            className="w-full h-full object-cover opacity-35"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/20 to-primary" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center space-y-8">
          <motion.span 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-block text-accent text-xs tracking-[0.4em] uppercase font-semibold"
          >
            Premium Photo Framing Studio
          </motion.span>
          
          <motion.h1 
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="font-display text-4xl sm:text-6xl md:text-7xl font-bold leading-tight tracking-wide"
          >
            Frame Your Memories, <br />
            <span className="text-accent italic font-light font-serif">Forever.</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-white/70 max-w-2xl mx-auto text-sm sm:text-base md:text-lg font-light leading-relaxed"
          >
            Bring your physical prints or upload them digitally. Select from our curated collection of 40+ handcrafted wooden and metal styles. Hand-assembled with museum-grade precision.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4"
          >
            <MotionLink 
              to="/frames"
              whileHover={{ scale: 1.06, y: -2, boxShadow: '0 10px 25px -5px rgba(249, 168, 212, 0.4)' }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
              className="w-full sm:w-auto border border-accent text-accent hover:bg-accent hover:text-primary px-8 py-4 rounded-full font-semibold tracking-widest uppercase text-xs transition-all duration-300 text-center"
            >
              Explore Collection
            </MotionLink>
          </motion.div>
        </div>
      </section>

      {/* ── Why Choose Us (Luxury Features) ── */}
      <section className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div className="p-6 bg-white border border-[#eaeaea] rounded-2xl shadow-card hover:shadow-card-hover transition-all duration-300 space-y-4">
          <div className="h-10 w-10 bg-accent/10 rounded-full flex items-center justify-center text-accent">
            <ShieldCheck size={20} />
          </div>
          <h3 className="font-display text-lg font-bold text-primary">Museum Quality</h3>
          <p className="text-primary/60 text-xs leading-relaxed font-light">
            We use acid-free backing materials, premium mat board, and museum-grade glass to preserve your memories from degradation and UV light.
          </p>
        </div>

        <div className="p-6 bg-white border border-[#eaeaea] rounded-2xl shadow-card hover:shadow-card-hover transition-all duration-300 space-y-4">
          <div className="h-10 w-10 bg-accent/10 rounded-full flex items-center justify-center text-accent">
            <Paintbrush size={20} />
          </div>
          <h3 className="font-display text-lg font-bold text-primary">Expert Craftsmanship</h3>
          <p className="text-primary/60 text-xs leading-relaxed font-light">
            Every frame is hand-jointed, sanded, and assembled in our custom workshop. Corners are checked for perfect alignment.
          </p>
        </div>

        <div className="p-6 bg-white border border-[#eaeaea] rounded-2xl shadow-card hover:shadow-card-hover transition-all duration-300 space-y-4">
          <div className="h-10 w-10 bg-accent/10 rounded-full flex items-center justify-center text-accent">
            <Sliders size={20} />
          </div>
          <h3 className="font-display text-lg font-bold text-primary">Total Customization</h3>
          <p className="text-primary/60 text-xs leading-relaxed font-light">
            Choose details like width, frame style, anti-glare glass, colored mounts, or custom dimensions. Built exact to your specifications.
          </p>
        </div>

        <div className="p-6 bg-white border border-[#eaeaea] rounded-2xl shadow-card hover:shadow-card-hover transition-all duration-300 space-y-4">
          <div className="h-10 w-10 bg-accent/10 rounded-full flex items-center justify-center text-accent">
            <Truck size={20} />
          </div>
          <h3 className="font-display text-lg font-bold text-primary">Secure Logistics</h3>
          <p className="text-primary/60 text-xs leading-relaxed font-light">
            We package each custom frame in triple-layered bubble wrap and rigid wooden crates to ensure it arrives in pristine gallery condition.
          </p>
        </div>
      </section>

      {/* ── Featured Collection ── */}
      <section className="max-w-7xl mx-auto px-6 space-y-12">
        <div className="text-center space-y-3">
          <span className="text-accent text-[10px] tracking-[0.3em] font-semibold uppercase block">Curated Selection</span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-primary">Popular Frame Designs</h2>
          <div className="h-[2px] w-12 bg-accent mx-auto" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {loading ? (
            Array(4).fill(0).map((_, i) => <FrameSkeleton key={i} />)
          ) : (
            featuredFrames.map((frame) => (
              <div 
                key={frame.id}
                className="bg-white rounded-2xl overflow-hidden shadow-card border border-[#eaeaea] group flex flex-col justify-between transition-all duration-500 h-full hover:shadow-card-hover"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-gray-50 border-b border-[#f1f1f1]">
                  <img 
                    src={frame.imageUrl} 
                    alt={frame.name}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                    loading="lazy"
                  />
                  {frame.category && (
                    <span className="absolute top-4 left-4 bg-primary/95 text-white text-[9px] tracking-widest uppercase px-3 py-1.5 rounded-full font-semibold">
                      {frame.category.name}
                    </span>
                  )}
                </div>
                
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="text-[9px] tracking-widest text-accent font-bold uppercase mb-1">{frame.material}</div>
                    <h3 className="font-display text-lg font-bold text-primary group-hover:text-accent transition-colors">
                      <Link to={`/frames/${frame.slug}`}>{frame.name}</Link>
                    </h3>
                    <p className="text-primary/60 text-xs mt-2 line-clamp-2 leading-relaxed font-light">{frame.description}</p>
                  </div>
                  
                  <div className="pt-4 flex justify-between items-center border-t border-[#f5f5f5] mt-4">
                    <div>
                      <span className="text-[9px] uppercase text-primary/40 tracking-widest block">Starting Price</span>
                      <span className="font-display text-base font-bold text-primary">₹{frame.basePrice}</span>
                    </div>
                    <Link 
                      to={`/configure?frame=${frame.slug}`}
                      className="bg-primary hover:bg-accent text-white hover:text-primary px-4 py-2 rounded-full text-[9px] font-semibold tracking-widest uppercase transition-all duration-300"
                    >
                      Frame Now
                    </Link>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="text-center pt-4">
          <Link 
            to="/frames" 
            className="inline-flex items-center gap-2 text-primary hover:text-accent font-semibold tracking-widest uppercase text-xs transition-colors"
          >
            View Full Catalog <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      {/* ── Before & After Frame Visualizer ── */}
      <section className="bg-primary text-white py-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="text-accent text-[10px] tracking-[0.3em] font-semibold uppercase block">The Magic of Framing</span>
            <h2 className="font-display text-3xl md:text-5xl font-bold leading-tight">See the Transformation</h2>
            <p className="text-white/70 font-light text-sm md:text-base leading-relaxed">
              Unframed artwork can fade, bend, and feel incomplete on a wall. A premium handcrafted frame adds weight, structure, protection, and turns a simple print into a grand visual statement.
            </p>
            <div className="pt-4">
              <Link 
                to="/configure"
                className="bg-accent text-primary hover:bg-white px-8 py-3.5 rounded-full font-semibold tracking-widest uppercase text-xs transition-all duration-300 shadow-luxury"
              >
                Try the Visual Configurator
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-3">
              <span className="text-xs uppercase text-white/50 tracking-widest block text-center">Plain Print</span>
              <div className="aspect-[3/4] bg-white p-3 shadow-luxury flex items-center justify-center rounded-lg">
                <img 
                  src="https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=400&q=80" 
                  alt="Plain Print" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="space-y-3">
              <span className="text-xs uppercase text-accent tracking-widest block text-center">Craft Creator's Frame</span>
              <div className="aspect-[3/4] bg-white p-2 flex items-center justify-center rounded-lg shadow-luxury-lg relative">
                {/* Visual Representation of Frame Border */}
                <div className="w-full h-full border-[18px] border-primary p-3 bg-white flex items-center justify-center">
                  <img 
                    src="https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=400&q=80" 
                    alt="Framed Print" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Framing Services ── */}
      <section className="max-w-7xl mx-auto px-6 space-y-12">
        <div className="text-center space-y-3">
          <span className="text-accent text-[10px] tracking-[0.3em] font-semibold uppercase block">Expert Options</span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-primary">Specialized Framing Services</h2>
          <div className="h-[2px] w-12 bg-accent mx-auto" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.slice(0, 3).map((service) => (
            <div 
              key={service.id}
              className="bg-white border border-[#eaeaea] rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-all duration-300 space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <span className="inline-block text-[9px] font-bold text-accent uppercase tracking-widest bg-accent/5 px-3 py-1 rounded-full">
                  {service.duration}
                </span>
                <h3 className="font-display text-xl font-bold text-primary">{service.title}</h3>
                <p className="text-primary/60 text-xs font-light leading-relaxed line-clamp-3">{service.description}</p>
              </div>
              <div className="pt-6 flex justify-between items-center border-t border-[#f5f5f5] mt-6">
                <span className="text-xs font-semibold text-primary">Starting ₹{service.startingPrice}</span>
                <Link 
                  to={`/services/${service.slug}`}
                  className="text-primary hover:text-accent font-semibold tracking-widest uppercase text-[10px] transition-colors"
                >
                  Learn More &rarr;
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link 
            to="/services" 
            className="inline-flex items-center gap-2 text-primary hover:text-accent font-semibold tracking-widest uppercase text-xs transition-colors"
          >
            View All Services &rarr;
          </Link>
        </div>
      </section>

      {/* ── Testimonials ── */}
      {testimonials.length > 0 && (
        <section className="bg-white border-t border-b border-[#eaeaea] py-20">
          <div className="max-w-5xl mx-auto px-6 space-y-12">
            <div className="text-center space-y-3">
              <span className="text-accent text-[10px] tracking-[0.3em] font-semibold uppercase block">Reviews</span>
              <h2 className="font-display text-3xl font-bold text-primary">What Our Clients Say</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((test) => (
                <div key={test.id} className="space-y-4 p-6 bg-gray-50 rounded-2xl border border-gray-100 flex flex-col justify-between">
                  <p className="text-primary/75 text-xs italic font-light leading-relaxed">
                    "{test.quote}"
                  </p>
                  <div>
                    <StarRating rating={test.rating} className="mb-2" />
                    <h4 className="font-bold text-xs text-primary">{test.name}</h4>
                    <span className="text-[10px] text-primary/40 uppercase tracking-widest">{test.title}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Newsletter Subscription ── */}
      <section className="max-w-4xl mx-auto px-6 bg-primary text-white rounded-3xl p-12 relative overflow-hidden shadow-luxury text-center space-y-6">
        <span className="text-accent text-[10px] tracking-[0.3em] font-semibold uppercase block">Studio Updates</span>
        <h2 className="font-display text-2xl md:text-3xl font-bold">Join Craft Creator's Circle</h2>
        <p className="text-white/60 text-xs font-light max-w-md mx-auto leading-relaxed">
          Subscribe for early access to framing design collections, seasonal maintenance tips, and special gallery features.
        </p>

        {newsletterSubscribed ? (
          <p className="text-accent font-semibold text-xs tracking-wider uppercase">Thank you! You are now subscribed.</p>
        ) : (
          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto pt-4">
            <input 
              type="email" 
              placeholder="Your email address" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 bg-white/10 border border-white/20 px-6 py-3.5 rounded-full text-xs placeholder-white/40 focus:outline-none focus:border-accent text-white"
            />
            <button 
              type="submit"
              className="bg-white hover:bg-accent text-primary py-3.5 px-8 rounded-full font-semibold tracking-widest uppercase text-xs transition-all duration-300 shadow-luxury"
            >
              Subscribe
            </button>
          </form>
        )}
      </section>

      {/* ── WhatsApp Quick CTA ── */}
      <section className="text-center space-y-4 py-10">
        <h3 className="font-display text-2xl font-bold text-primary">Need a Quick Estimate?</h3>
        <p className="text-primary/60 text-xs max-w-sm mx-auto font-light leading-relaxed">
          Send us your dimensions or photo directly via WhatsApp and our master framers will give you an instant quote.
        </p>
        <div className="pt-2">
          <a
            href="https://wa.me/918077037277?text=Hello%2C%20I%20would%20like%20to%20get%20a%20price%20estimate%20for%20custom%20photo%20framing."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20ba5a] text-white px-8 py-3.5 rounded-full font-semibold tracking-widest uppercase text-xs transition-all duration-300 shadow-luxury"
          >
            <WhatsAppIcon /> Instant WhatsApp Quote
          </a>
        </div>
      </section>

    </div>
  );
};

export default HomePage;
