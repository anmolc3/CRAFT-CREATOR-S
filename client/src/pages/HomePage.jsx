import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronDown, Star, Quote, Camera, Award, Globe, ShoppingBag, Folder } from 'lucide-react';
import { photoService } from '../services/photoService';
import { collectionService } from '../services/collectionService';

const SERVICES = [
  { icon: Camera, title: 'Portrait Sessions', desc: 'Intimate, editorial-grade portraits that capture your authentic self.' },
  { icon: Globe, title: 'Travel & Landscape', desc: 'Fine art landscape photography from the Himalayas to the Sahara.' },
  { icon: Award, title: 'Wildlife Safaris', desc: 'Guided wildlife photography expeditions across India and Africa.' },
  { icon: ShoppingBag, title: 'Print Store', desc: 'Museum-quality fine art prints, custom framed and delivered to your door.', link: '/services' },
];

const TESTIMONIALS = [
  { name: 'Priya Sharma', role: 'Art Collector, Delhi', quote: 'The print quality is extraordinary — it transformed my living room into a gallery. Sikhar\'s eye for light is unmatched.', rating: 5 },
  { name: 'James Harlow', role: 'Interior Designer, London', quote: 'I\'ve sourced artwork from galleries worldwide. Sikhar\'s limited editions are among the finest I\'ve encountered.', rating: 5 },
  { name: 'Meera Nair', role: 'Wedding Client, Mumbai', quote: 'Our wedding photographs are breathtaking. He captured moments we didn\'t even know were happening.', rating: 5 },
];

const STATS = [
  { value: '12+', label: 'Years of Experience' },
  { value: '6', label: 'Continents Explored' },
  { value: '500+', label: 'Prints Sold' },
  { value: '40+', label: 'Awards Won' },
];

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94], delay },
  }),
};

const HERO_IMAGES = [
  'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=1600&q=90',
  'https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?w=1600&q=90',
  'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=1600&q=90',
  'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=1600&q=90'
];

// ─── Hero Section ─────────────────────────────────────────────────────────────
const Hero = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const [currentWord, setCurrentWord] = useState(0);
  const words = ['Light', 'Moments', 'Stories', 'Eternity'];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const wordInterval = setInterval(() => {
      setCurrentWord(prev => (prev + 1) % words.length);
    }, 2500);

    const imageInterval = setInterval(() => {
      setCurrentImageIndex(prev => (prev + 1) % HERO_IMAGES.length);
    }, 6000);

    return () => {
      clearInterval(wordInterval);
      clearInterval(imageInterval);
    };
  }, []);

  return (
    <section ref={ref} className="relative h-screen min-h-[700px] flex items-center justify-center overflow-hidden">
      <motion.div style={{ y }} className="absolute inset-0 z-0">
        <AnimatePresence>
          <motion.img
            key={currentImageIndex}
            src={HERO_IMAGES[currentImageIndex]}
            alt="Hero background"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2.0, ease: 'easeInOut' }}
            className="absolute inset-0 w-full h-full object-cover"
            draggable={false}
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/70 z-10" />
      </motion.div>

      <motion.div style={{ opacity }} className="relative z-10 text-center text-white px-4 max-w-5xl mx-auto">
        <motion.span variants={fadeUp} initial="hidden" animate="visible" custom={0} className="inline-block text-accent text-xs tracking-[0.4em] uppercase font-body font-medium mb-6">
          Fine Art Photography
        </motion.span>

        <motion.h1 variants={fadeUp} initial="hidden" animate="visible" custom={0.15} className="font-display text-6xl md:text-8xl font-bold leading-[1.05] mb-4">
          Capturing{' '}
          <span className="relative inline-block min-w-[220px] md:min-w-[340px]">
            <AnimatePresence mode="wait">
              <motion.span
                key={currentWord}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="gradient-text absolute left-0"
              >
                {words[currentWord]}
              </motion.span>
            </AnimatePresence>
            &nbsp;
          </span>
        </motion.h1>

        <motion.p variants={fadeUp} initial="hidden" animate="visible" custom={0.3} className="text-white/75 text-lg md:text-xl font-light font-body max-w-2xl mx-auto mb-10 leading-relaxed">
          Museum-quality fine art prints from India and beyond — landscapes, wildlife, and the poetry of the natural world.
        </motion.p>

        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0.45} className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a href="#portfolio" className="btn-gold">
            Explore Portfolio <ArrowRight size={16} />
          </a>
          <Link to="/book" className="btn-ghost text-white border border-white/30 hover:border-white hover:bg-white/10 px-8 py-3.5">
            Book a Session <ArrowRight size={16} />
          </Link>
        </motion.div>
      </motion.div>

      <motion.div animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 2 }} className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 text-white/50 flex flex-col items-center gap-2">
        <span className="text-[10px] tracking-[0.3em] uppercase font-body">Scroll</span>
        <ChevronDown size={18} />
      </motion.div>
    </section>
  );
};

// ─── Stats Bar ────────────────────────────────────────────────────────────────
const StatsBar = () => (
  <section className="bg-primary text-white py-10">
    <div className="container-luxury grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
      {STATS.map((stat, i) => (
        <motion.div key={stat.label} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i * 0.1}>
          <p className="font-display text-4xl text-accent mb-1">{stat.value}</p>
          <p className="text-white/50 text-xs tracking-widest uppercase font-body">{stat.label}</p>
        </motion.div>
      ))}
    </div>
  </section>
);

// ─── Curated Collections ──────────────────────────────────────────────────────
const CuratedCollections = ({ collections }) => (
  <section className="py-20 bg-[#f9f9f9]">
    <div className="container-luxury">
      <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="mb-12">
        <span className="text-accent text-xs tracking-[0.35em] uppercase font-body font-medium block mb-3">Series & Collections</span>
        <h2 className="section-heading text-4xl md:text-5xl">Curated Series</h2>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {collections.map((col, i) => (
          <motion.div
            key={col.id}
            variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i * 0.1}
            className="group relative h-80 overflow-hidden bg-primary shadow-luxury"
          >
            {col.imageUrl ? (
              <img src={col.imageUrl} alt={col.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-primary to-secondary" />
            )}
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors" />
            <div className="absolute inset-0 flex flex-col justify-end p-6 text-white z-10">
              <span className="text-[10px] tracking-widest text-accent uppercase font-semibold mb-2 flex items-center gap-1.5">
                <Folder size={12} /> {col._count?.photos || 0} Photographs
              </span>
              <h3 className="font-display text-2xl text-white mb-2">{col.name}</h3>
              <p className="text-white/60 text-xs font-body font-light line-clamp-2 mb-4">{col.description}</p>
              <Link to={`/collections/${col.slug}`} className="text-white text-xs tracking-widest uppercase font-semibold inline-flex items-center gap-2 group-hover:gap-3 transition-all">
                Explore Series <ArrowRight size={14} />
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

// ─── Featured Gallery ─────────────────────────────────────────────────────────
const FeaturedGallery = ({ photos }) => {
  const [hovered, setHovered] = useState(null);

  return (
    <section id="portfolio" className="py-24 bg-background">
      <div className="container-luxury">
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
          <div>
            <span className="text-accent text-xs tracking-[0.35em] uppercase font-body font-medium block mb-3">Portfolio</span>
            <h2 className="section-heading text-4xl md:text-5xl">Selected Works</h2>
          </div>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {photos.map((item, i) => (
            <motion.div
              key={item.id}
              variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i * 0.08}
              className={`photo-card group relative ${item.orientation === 'portrait' ? 'row-span-2' : ''}`}
              onMouseEnter={() => setHovered(item.id)}
              onMouseLeave={() => setHovered(null)}
            >
              <Link to={`/photos/${item.slug}`}>
                <div className={`overflow-hidden ${item.orientation === 'portrait' ? 'aspect-[3/4]' : 'aspect-[4/3]'}`}>
                  <motion.img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover no-drag no-select"
                    animate={{ scale: hovered === item.id ? 1.06 : 1 }}
                    transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
                    draggable={false}
                    onContextMenu={e => e.preventDefault()}
                  />
                </div>
                <div className="photo-card-overlay">
                  <motion.div
                    className="p-5 w-full"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: hovered === item.id ? 1 : 0, y: hovered === item.id ? 0 : 10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <p className="text-white/60 text-[10px] tracking-widest uppercase font-body mb-1">
                      {item.category?.name || 'Fine Art'}
                    </p>
                    <p className="text-white font-display text-lg">{item.title}</p>
                    <p className="text-white/80 text-xs font-body mt-1">₹{item.basePrice?.toLocaleString('en-IN')}</p>
                  </motion.div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ─── Services Section ─────────────────────────────────────────────────────────
const ServicesSection = () => (
  <section className="py-24 bg-primary text-white">
    <div className="container-luxury">
      <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-16">
        <span className="text-accent text-xs tracking-[0.35em] uppercase font-body font-medium block mb-3">What I Offer</span>
        <h2 className="font-display text-4xl md:text-5xl text-white mb-4">Services & Prints</h2>
        <p className="text-white/50 max-w-xl mx-auto text-base font-light leading-relaxed">
          From commissioned shoots to museum-quality prints delivered to your home — every service crafted with obsessive attention to detail.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {SERVICES.map((s, i) => (
          <motion.div key={s.title} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i * 0.1} className="glass p-8 group hover:bg-white/10 transition-all duration-500 cursor-default">
            <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mb-6 group-hover:bg-accent/20 transition-colors">
              <s.icon size={22} className="text-accent" />
            </div>
            <h3 className="font-display text-xl text-white mb-3">{s.title}</h3>
            <p className="text-white/50 text-sm leading-relaxed font-light">{s.desc}</p>
            {s.link && (
              <Link to={s.link} className="inline-flex items-center gap-2 text-accent text-xs tracking-widest uppercase mt-5 hover:gap-3 transition-all">
                Explore <ArrowRight size={13} />
              </Link>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

// ─── About / Philosophy Section ───────────────────────────────────────────────
const AboutSection = () => (
  <section className="py-24 bg-background">
    <div className="container-luxury">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="relative">
          <div className="aspect-[4/5] overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1554080353-a576cf803bda?w=800&q=80"
              alt="Photographer at work"
              className="w-full h-full object-cover no-drag no-select"
              draggable={false}
              onContextMenu={e => e.preventDefault()}
            />
          </div>
          <div className="absolute -bottom-6 -right-6 w-40 h-40 bg-accent/10 border border-accent/20 -z-10" />
          <div className="absolute -top-6 -left-6 w-24 h-24 bg-primary/5 border border-primary/10 -z-10" />
        </motion.div>

        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0.2}>
          <span className="text-accent text-xs tracking-[0.35em] uppercase font-body font-medium block mb-4">The Artist</span>
          <h2 className="section-heading text-4xl md:text-5xl mb-8">Obsessed With<br />Perfect Light</h2>
          <p className="text-primary-600 leading-relaxed mb-5 text-base">
            I'm Sikhar — an award-winning fine art photographer based in Mumbai. For over a decade, I've chased extraordinary light from the Himalayas to the Sahara, from Arctic fjords to the jungles of Central India.
          </p>
          <p className="text-primary-600 leading-relaxed mb-5 text-base">
            My work is about more than pressing a shutter — it's about patience, presence, and returning home with something that stops people mid-step. Every limited-edition print is personally reviewed, signed, and shipped in museum archival packaging.
          </p>
          <p className="text-primary-600 leading-relaxed mb-10 text-base">
            My prints are held in private collections across six continents, and I've exhibited in galleries in London, New York, Mumbai, and Singapore.
          </p>
          <Link to="/book" className="btn-primary">
            Commission a Shoot <ArrowRight size={15} />
          </Link>
        </motion.div>
      </div>
    </div>
  </section>
);

// ─── Print Store CTA ─────────────────────────────────────────────────────────
const PrintStoreCTA = () => (
  <section className="relative py-32 overflow-hidden">
    <div className="absolute inset-0 z-0">
      <img
        src="https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1600&q=80"
        alt="Fine art print"
        className="w-full h-full object-cover no-drag"
        draggable={false}
        onContextMenu={e => e.preventDefault()}
      />
      <div className="absolute inset-0 bg-black/70" />
    </div>
    <div className="relative z-10 container-luxury text-center text-white">
      <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
        <span className="text-accent text-xs tracking-[0.4em] uppercase font-body font-medium block mb-4">Fine Art Prints</span>
        <h2 className="font-display text-5xl md:text-7xl mb-6 leading-tight">
          Own a Piece of<br />the World
        </h2>
        <p className="text-white/60 text-lg max-w-2xl mx-auto mb-10 font-light leading-relaxed">
          Limited-edition prints on Hahnemühle Fine Art paper. Custom framing options. Each print numbered, signed, and delivered with a certificate of authenticity. Order via WhatsApp — it's that simple.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a href="#portfolio" className="btn-gold">
            Browse the Store <ShoppingBag size={16} />
          </a>
          <Link to="/book" className="btn-ghost text-white border border-white/30 hover:bg-white/10 hover:border-white px-8 py-3.5">
            Custom Order <ArrowRight size={16} />
          </Link>
        </div>
      </motion.div>
    </div>
  </section>
);

// ─── Testimonials ─────────────────────────────────────────────────────────────
const Testimonials = () => (
  <section className="py-24 bg-background">
    <div className="container-luxury">
      <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-16">
        <span className="text-accent text-xs tracking-[0.35em] uppercase font-body font-medium block mb-3">Testimonials</span>
        <h2 className="font-display text-4xl md:text-5xl text-primary">What Collectors Say</h2>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {TESTIMONIALS.map((t, i) => (
          <motion.div key={t.name} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i * 0.12} className="luxury-card p-8 relative">
            <Quote size={32} className="text-accent/20 absolute top-6 right-6" />
            <div className="flex gap-1 mb-5">
              {Array.from({ length: t.rating }).map((_, j) => (
                <Star key={j} size={14} className="fill-accent text-accent" />
              ))}
            </div>
            <p className="text-primary-600 text-sm leading-relaxed mb-6 italic">"{t.quote}"</p>
            <div>
              <p className="font-body font-semibold text-primary text-sm">{t.name}</p>
              <p className="text-primary-400 text-xs font-body mt-0.5">{t.role}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

// ─── Newsletter CTA ───────────────────────────────────────────────────────────
const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
  };

  return (
    <section className="py-20 bg-primary-50 border-y border-primary-100">
      <div className="container-luxury text-center max-w-2xl mx-auto">
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <span className="text-accent text-xs tracking-[0.35em] uppercase font-body font-medium block mb-3">Stay in Touch</span>
          <h2 className="font-display text-3xl md:text-4xl text-primary mb-4">New Prints. First Access.</h2>
          <p className="text-primary-500 text-sm mb-8 leading-relaxed">
            Join the collector's list — be the first to know about new limited-edition releases and behind-the-scenes dispatches from the field.
          </p>
          {submitted ? (
            <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-accent font-body font-medium tracking-wide">
              ✓ You're on the list. Thank you.
            </motion.p>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Your email address"
                required
                className="form-input flex-1"
              />
              <button type="submit" className="btn-primary whitespace-nowrap">
                Subscribe
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
};

// ─── Home Page ────────────────────────────────────────────────────────────────
const HomePage = () => {
  const [photos, setPhotos] = useState([]);
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [photoRes, collectionRes] = await Promise.all([
          photoService.getAll({ limit: 12, status: 'published' }),
          collectionService.getAll(),
        ]);
        // Deduplicate by id in case the API returns duplicates
        const rawPhotos = photoRes.data || [];
        const seen = new Set();
        const uniquePhotos = rawPhotos.filter(p => {
          if (seen.has(p.id)) return false;
          seen.add(p.id);
          return true;
        });
        setPhotos(uniquePhotos);
        setCollections(collectionRes.data || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div>
      <Hero />
      <StatsBar />
      {collections.length > 0 && <CuratedCollections collections={collections} />}
      {loading ? (
        <div className="container-luxury py-20 text-center">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="skeleton aspect-[4/3]" />
            ))}
          </div>
        </div>
      ) : (
        photos.length > 0 && <FeaturedGallery photos={photos} />
      )}
      <ServicesSection />
      <AboutSection />
      <PrintStoreCTA />
      <Testimonials />
      <Newsletter />
    </div>
  );
};

export default HomePage;
