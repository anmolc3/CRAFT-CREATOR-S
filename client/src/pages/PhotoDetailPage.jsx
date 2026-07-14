import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart, Share2, ZoomIn, X, ChevronLeft, ChevronRight,
  MapPin, Camera, Aperture, Clock, Tag, Maximize2,
  ShoppingBag, ArrowLeft, ArrowRight, Check, Star, MessageCircle
} from 'lucide-react';
import { photoService } from '../services/photoService';
import { frameService, sizeService } from '../services/frameService';
import { finishService, glassService, mountService } from '../services/configuratorService';
import { analyticsService } from '../services/analyticsService';

// ─── Favourites helpers ───────────────────────────────────────────────────────
const getFavs = () => JSON.parse(localStorage.getItem('sikhar_favs') || '[]');
const setFavs = (ids) => localStorage.setItem('sikhar_favs', JSON.stringify(ids));
const isFav = (id) => getFavs().includes(id);
const toggleFav = (id) => {
  const favs = getFavs();
  const next = favs.includes(id) ? favs.filter(f => f !== id) : [...favs, id];
  setFavs(next);
  return next.includes(id);
};

// ─── Room Mockups ─────────────────────────────────────────────────────────────
const ROOMS = [
  // Living room — centered on blank wall above the couch. Wall runs x=15%-78%, couch top ~y=46%.
  { id: 'living', label: 'Living Room', bg: '/living-room-wall.jpg', top: '16%', left: '36%', w: '18%' },
  // Bedroom — frame on wall above bed (pixel-analyzed).
  { id: 'bedroom', label: 'Bedroom', bg: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=900&q=80', top: '9.6%', left: '41.7%', w: '17.4%' },
  // Office — dark blue wall on left side. Slightly larger photo.
  { id: 'office', label: 'Office', bg: '/office-wall.jpg', top: '20%', left: '4%', w: '16%' },
  // Hotel lobby — cover black vertical slats on center stone wall. Slats at x=37-57%, y=27-52%.
  { id: 'hotel', label: 'Hotel Lobby', bg: '/hotel-lobby-wall.jpg', top: '27%', left: '37%', w: '20%' },
  // Café — horizontal frame on cafe wall at x=1228-1932, y=1051.
  { id: 'cafe', label: 'Café', bg: '/cafe-wall.jpg', top: '61.8%', left: '40.6%', w: '23.3%' },
  // Gallery — large frame on gallery wall at x=463-1300, y=200. Corrected for 16:9 vertical crop.
  { id: 'gallery', label: 'Gallery Wall', bg: '/gallery-wall.jpg', top: '13.9%', left: '30.1%', w: '54.5%' },
];

// ─── Frame colours for CSS simulation ────────────────────────────────────────
const FRAME_COLORS = { Black: '#111', White: '#f5f5f5', Oak: '#c19a6b', Walnut: '#5c3d2e', Gold: '#D4AF37' };

// ─── WhatsApp message builder ─────────────────────────────────────────────────
const buildWhatsAppMessage = ({ photo, size, finish, frame, glass, mount, qty, total }) => {
  const lines = [
    'Hello,',
    '',
    'I would like to order the following framed print.',
    '',
    `Photo: ${photo.title}`,
    `Category: ${photo.category?.name || 'N/A'}`,
    `Print Size: ${size?.label || 'N/A'}`,
    `Print Finish: ${finish?.name || 'N/A'}`,
    `Frame: ${frame ? frame.name : 'No Frame'}`,
    `Frame Material: ${frame ? frame.material : 'N/A'}`,
    `Glass: ${glass?.name || 'N/A'}`,
    `Mount: ${mount?.name || 'N/A'}`,
    `Quantity: ${qty}`,
    '',
    `Total Price: ₹${total.toLocaleString('en-IN')}`,
    '',
    'Estimated Production: 5–7 Days',
    '',
    'Please let me know the payment process, shipping charges, and delivery timeline.',
  ];
  return encodeURIComponent(lines.join('\n'));
};

// ─── Lightbox ─────────────────────────────────────────────────────────────────
const Lightbox = ({ images, activeIdx, onClose, onPrev, onNext }) => (
  <AnimatePresence>
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center"
      onClick={onClose}
    >
      <button onClick={onClose} className="absolute top-6 right-6 text-white/60 hover:text-white z-10">
        <X size={32} />
      </button>
      <button onClick={(e) => { e.stopPropagation(); onPrev(); }}
        className="absolute left-4 text-white/60 hover:text-white z-10 p-3">
        <ChevronLeft size={36} />
      </button>
      <motion.img
        key={activeIdx}
        src={images[activeIdx]}
        alt=""
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0 }}
        className="max-h-[90vh] max-w-[90vw] object-contain select-none"
        onClick={(e) => e.stopPropagation()}
        draggable={false}
        onContextMenu={(e) => e.preventDefault()}
      />
      <button onClick={(e) => { e.stopPropagation(); onNext(); }}
        className="absolute right-4 text-white/60 hover:text-white z-10 p-3">
        <ChevronRight size={36} />
      </button>
      <div className="absolute bottom-6 text-white/40 text-xs font-body">
        {activeIdx + 1} / {images.length}
      </div>
    </motion.div>
  </AnimatePresence>
);

// ─── Selector Option ──────────────────────────────────────────────────────────
const OptionBtn = ({ active, onClick, children }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 text-sm font-body border transition-all duration-200 ${
      active
        ? 'border-accent bg-accent/10 text-primary font-medium'
        : 'border-primary-200 text-primary-600 hover:border-accent hover:text-accent'
    }`}
  >
    {children}
  </button>
);

// ─── Main Page ────────────────────────────────────────────────────────────────
const PhotoDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [photo, setPhoto] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);

  // Configurator options from API
  const [sizes, setSizes] = useState([]);
  const [finishes, setFinishes] = useState([]);
  const [frames, setFrames] = useState([]);
  const [glassOpts, setGlassOpts] = useState([]);
  const [mountOpts, setMountOpts] = useState([]);

  // Selected config
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedFinish, setSelectedFinish] = useState(null);
  const [selectedFrame, setSelectedFrame] = useState(null);
  const [selectedGlass, setSelectedGlass] = useState(null);
  const [selectedMount, setSelectedMount] = useState(null);
  const [qty, setQty] = useState(1);

  // UI state
  const [fav, setFav] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIdx, setLightboxIdx] = useState(0);
  const [activeRoom, setActiveRoom] = useState(ROOMS[0]);
  const [activeThumb, setActiveThumb] = useState(0);
  const [copied, setCopied] = useState(false);

  // Room mockup drag + scale state
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [photoScale, setPhotoScale] = useState(1);
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0, ox: 0, oy: 0 });
  const mockupRef = useRef(null);

  // Reset drag & scale whenever room changes
  useEffect(() => {
    setDragOffset({ x: 0, y: 0 });
    setPhotoScale(1);
  }, [activeRoom.id]);

  // Mouse drag handlers
  const handleMouseDown = useCallback((e) => {
    e.preventDefault();
    isDragging.current = true;
    dragStart.current = { x: e.clientX, y: e.clientY, ox: dragOffset.x, oy: dragOffset.y };
    const onMove = (ev) => {
      if (!isDragging.current) return;
      setDragOffset({ x: dragStart.current.ox + (ev.clientX - dragStart.current.x), y: dragStart.current.oy + (ev.clientY - dragStart.current.y) });
    };
    const onUp = () => { isDragging.current = false; window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  }, [dragOffset]);

  // Touch drag handlers
  const handleTouchStart = useCallback((e) => {
    if (e.touches.length !== 1) return;
    isDragging.current = true;
    dragStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY, ox: dragOffset.x, oy: dragOffset.y };
  }, [dragOffset]);
  const handleTouchMove = useCallback((e) => {
    if (!isDragging.current || e.touches.length !== 1) return;
    e.preventDefault();
    setDragOffset({ x: dragStart.current.ox + (e.touches[0].clientX - dragStart.current.x), y: dragStart.current.oy + (e.touches[0].clientY - dragStart.current.y) });
  }, []);
  const handleTouchEnd = useCallback(() => { isDragging.current = false; }, []);

  // Scroll-to-resize
  const handleWheel = useCallback((e) => {
    e.preventDefault();
    setPhotoScale(s => Math.max(0.3, Math.min(3, s - e.deltaY * 0.001)));
  }, []);

  // Fetch photo & config
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const [photoRes, relatedRes, sizesRes, finishesRes, framesRes, glassRes, mountRes] = await Promise.all([
          photoService.getBySlug(slug),
          photoService.getRelated(slug),
          sizeService.getAll(),
          finishService.getAll(),
          frameService.getAll(),
          glassService.getAll(),
          mountService.getAll(),
        ]);

        const p = photoRes.data;
        setPhoto(p);
        setRelated(relatedRes.data || []);
        setFav(isFav(p.id));

        const szData = sizesRes.data || [];
        const fnData = finishesRes.data || [];
        const frData = framesRes.data || [];
        const glData = glassRes.data || [];
        const mnData = mountRes.data || [];

        setSizes(szData);
        setFinishes(fnData);
        setFrames(frData);
        setGlassOpts(glData);
        setMountOpts(mnData);

        // Defaults
        if (szData.length) setSelectedSize(szData[0]);
        if (fnData.length) setSelectedFinish(fnData[0]);
        if (glData.length) setSelectedGlass(glData[0]);
        if (mnData.length) setSelectedMount(mnData[0]);

        analyticsService.track('view', p.id).catch(() => {});
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
    window.scrollTo(0, 0);
  }, [slug]);

  // Live total price
  const total = (() => {
    const base = photo?.basePrice || 0;
    const sz = selectedSize?.basePrice || 0;
    const fn = selectedFinish?.price || 0;
    const fr = selectedFrame?.price || 0;
    const gl = selectedGlass?.price || 0;
    const mn = selectedMount?.price || 0;
    return (base + sz + fn + fr + gl + mn) * qty;
  })();

  const allImages = photo ? [photo.imageUrl, ...(photo.galleryImages || [])].filter(Boolean) : [];

  const openLightbox = (idx) => { setLightboxIdx(idx); setLightboxOpen(true); };
  const closeLightbox = () => setLightboxOpen(false);
  const prevImg = () => setLightboxIdx((i) => (i - 1 + allImages.length) % allImages.length);
  const nextImg = () => setLightboxIdx((i) => (i + 1) % allImages.length);

  const handleFav = () => {
    if (!photo) return;
    const newState = toggleFav(photo.id);
    setFav(newState);
    analyticsService.track('favorite', photo.id).catch(() => {});
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsApp = () => {
    if (!photo) return;
    const phone = import.meta.env.VITE_WHATSAPP_NUMBER || '919876543210';
    const msg = buildWhatsAppMessage({
      photo, size: selectedSize, finish: selectedFinish,
      frame: selectedFrame, glass: selectedGlass, mount: selectedMount,
      qty, total,
    });
    analyticsService.track('whatsapp_click', photo.id).catch(() => {});
    window.open(`https://wa.me/${phone}?text=${msg}`, '_blank');
  };

  if (loading) {
    return (
      <div className="pt-24 container-luxury">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="skeleton aspect-[4/5]" />
          <div className="space-y-4">
            {[...Array(6)].map((_, i) => <div key={i} className={`skeleton h-8 rounded ${i === 0 ? 'w-3/4' : 'w-full'}`} />)}
          </div>
        </div>
      </div>
    );
  }

  if (!photo) {
    return (
      <div className="pt-40 text-center">
        <h1 className="font-display text-3xl mb-4">Photo Not Found</h1>
        <Link to="/" className="btn-primary">Back to Home</Link>
      </div>
    );
  }

  const editionRemaining = photo.limitedEdition ? photo.editionSize - photo.editionSold : null;

  return (
    <div className="bg-background min-h-screen">
      {/* Lightbox */}
      {lightboxOpen && (
        <Lightbox images={allImages} activeIdx={lightboxIdx} onClose={closeLightbox} onPrev={prevImg} onNext={nextImg} />
      )}

      <div className="pt-24 pb-24">
        {/* Breadcrumb */}
        <div className="container-luxury mb-8">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-primary-400 hover:text-accent text-sm font-body transition-colors">
            <ArrowLeft size={16} /> Back
          </button>
        </div>

        <div className="container-luxury">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-20">

            {/* ── LEFT: Image Panel ───────────────────────────────────────── */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="relative group overflow-hidden aspect-[4/5] image-protected">
                <motion.img
                  src={allImages[activeThumb] || photo.imageUrl}
                  alt={photo.title}
                  className="w-full h-full object-cover no-drag no-select"
                  draggable={false}
                  onContextMenu={(e) => e.preventDefault()}
                  whileHover={{ scale: 1.03 }}
                  transition={{ duration: 0.5 }}
                />
                {/* Badges */}
                <div className="absolute top-4 left-4 flex gap-2 z-10">
                  {photo.limitedEdition && (
                    <span className="badge-limited">Limited Edition</span>
                  )}
                  {photo.bestSeller && (
                    <span className="badge-featured">Best Seller</span>
                  )}
                </div>
                {/* Zoom button */}
                <button
                  onClick={() => openLightbox(activeThumb)}
                  className="absolute bottom-4 right-4 bg-white/90 hover:bg-white text-primary p-2.5 opacity-0 group-hover:opacity-100 transition-all duration-300 z-10"
                >
                  <ZoomIn size={20} />
                </button>
                {/* Fullscreen icon */}
                <button
                  onClick={() => openLightbox(activeThumb)}
                  className="absolute top-4 right-4 bg-white/90 hover:bg-white text-primary p-2.5 opacity-0 group-hover:opacity-100 transition-all duration-300 z-10"
                >
                  <Maximize2 size={18} />
                </button>
              </div>

              {/* Thumbnails */}
              {allImages.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-1">
                  {allImages.map((src, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveThumb(i)}
                      className={`shrink-0 w-20 h-20 overflow-hidden border-2 transition-all duration-200 ${
                        activeThumb === i ? 'border-accent' : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={src}
                        alt=""
                        className="w-full h-full object-cover no-drag no-select"
                        draggable={false}
                        onContextMenu={(e) => e.preventDefault()}
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* Room Mockup Preview */}
              <div>
                <p className="text-xs uppercase tracking-widest font-body text-primary-400 mb-3">Room Preview</p>
                {/* Room selector tabs */}
                <div className="flex gap-2 flex-wrap mb-4">
                  {ROOMS.map(room => (
                    <button
                      key={room.id}
                      onClick={() => setActiveRoom(room)}
                      className={`text-xs px-3 py-1.5 border font-body transition-all ${
                        activeRoom.id === room.id
                          ? 'border-accent text-accent bg-accent/5'
                          : 'border-primary-200 text-primary-500 hover:border-primary'
                      }`}
                    >
                      {room.label}
                    </button>
                  ))}
                </div>
                {/* Room preview */}
                <div
                  ref={mockupRef}
                  className="relative aspect-[16/9] overflow-hidden bg-primary-50 select-none"
                  onWheel={handleWheel}
                  style={{ touchAction: 'none' }}
                >
                  <img src={activeRoom.bg} alt={activeRoom.label} className="w-full h-full object-cover" draggable={false} />

                  {/* Draggable photo overlay */}
                  <div
                    className="absolute"
                    style={{
                      top: activeRoom.top,
                      left: activeRoom.left,
                      width: activeRoom.w,
                      transform: `translate(${dragOffset.x}px, ${dragOffset.y}px) scale(${photoScale})`,
                      transformOrigin: 'center center',
                      cursor: isDragging.current ? 'grabbing' : 'grab',
                      zIndex: 10,
                    }}
                    onMouseDown={handleMouseDown}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                  >
                    <div
                      className="relative"
                      style={{
                        padding: selectedFrame ? '8px' : '0',
                        background: selectedFrame ? FRAME_COLORS[selectedFrame.name] || '#111' : 'transparent',
                        boxShadow: selectedFrame ? '0 8px 32px rgba(0,0,0,0.5)' : '0 4px 24px rgba(0,0,0,0.35)',
                      }}
                    >
                      <img
                        src={photo.imageUrl}
                        alt={photo.title}
                        className="w-full object-cover no-drag no-select"
                        style={{ aspectRatio: photo.orientation === 'portrait' ? '3/4' : '4/3' }}
                        draggable={false}
                        onContextMenu={(e) => e.preventDefault()}
                      />
                    </div>
                  </div>

                  {/* Size controls overlay */}
                  <div className="absolute bottom-2 right-2 flex items-center gap-1 z-20">
                    <button
                      onClick={() => setPhotoScale(s => Math.max(0.3, s - 0.1))}
                      className="w-7 h-7 bg-black/60 hover:bg-black/80 text-white text-lg font-bold flex items-center justify-center backdrop-blur-sm transition-all"
                      title="Make smaller"
                    >−</button>
                    <button
                      onClick={() => { setDragOffset({ x: 0, y: 0 }); setPhotoScale(1); }}
                      className="px-2 h-7 bg-black/60 hover:bg-black/80 text-white text-xs font-body flex items-center justify-center backdrop-blur-sm transition-all"
                      title="Reset position & size"
                    >Reset</button>
                    <button
                      onClick={() => setPhotoScale(s => Math.min(3, s + 0.1))}
                      className="w-7 h-7 bg-black/60 hover:bg-black/80 text-white text-lg font-bold flex items-center justify-center backdrop-blur-sm transition-all"
                      title="Make larger"
                    >+</button>
                  </div>
                </div>

                 {/* User Instructions */}
                <div className="mt-4 flex flex-col gap-2">
                  <p className="text-xs font-body font-semibold text-primary uppercase tracking-wider mb-0.5">How to customise</p>
                  <div className="flex items-start gap-2 text-xs text-primary-500 font-body">
                    <span>•</span>
                    <span><strong className="text-primary font-semibold">Drag</strong> the photo to move it anywhere on the wall.</span>
                  </div>
                  <div className="flex items-start gap-2 text-xs text-primary-500 font-body">
                    <span>•</span>
                    <span><strong className="text-primary font-semibold">Scroll</strong> over the image to resize it (or use the − / + buttons).</span>
                  </div>
                  <div className="flex items-start gap-2 text-xs text-primary-500 font-body">
                    <span>•</span>
                    <span>On mobile, <strong className="text-primary font-semibold">touch & drag</strong> to move the photo.</span>
                  </div>
                  <div className="flex items-start gap-2 text-xs text-primary-500 font-body">
                    <span>•</span>
                    <span>Click <strong className="text-primary font-semibold">Reset</strong> to snap the photo back to the default position.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* ── RIGHT: Info + Configurator ──────────────────────────────── */}
            <div className="lg:sticky lg:top-28 space-y-8 self-start">

              {/* Title & Actions */}
              <div>
                {photo.category && (
                  <span className="text-accent text-xs tracking-widest uppercase font-body">{photo.category.name}</span>
                )}
                <h1 className="font-display text-4xl md:text-5xl text-primary mt-2 mb-3">{photo.title}</h1>
                {photo.location && (
                  <div className="flex items-center gap-1.5 text-primary-400 text-sm font-body mb-4">
                    <MapPin size={14} /> {photo.location}
                  </div>
                )}
                <div className="flex items-center gap-4">
                  <button onClick={handleFav} className={`flex items-center gap-2 text-sm font-body transition-colors ${fav ? 'text-red-500' : 'text-primary-400 hover:text-red-400'}`}>
                    <Heart size={18} fill={fav ? 'currentColor' : 'none'} />
                    {fav ? 'Saved' : 'Save'}
                  </button>
                  <button onClick={handleShare} className="flex items-center gap-2 text-sm font-body text-primary-400 hover:text-primary transition-colors">
                    {copied ? <Check size={18} className="text-accent" /> : <Share2 size={18} />}
                    {copied ? 'Copied!' : 'Share'}
                  </button>
                </div>
              </div>

              {/* Limited Edition */}
              {photo.limitedEdition && (
                <div className="border border-accent/30 bg-accent/5 p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Star size={14} className="text-accent fill-accent" />
                    <span className="text-xs uppercase tracking-widest font-body font-medium text-accent">Limited Edition</span>
                  </div>
                  <p className="text-primary text-sm font-body">
                    Edition {photo.editionSold + 1} of {photo.editionSize} —{' '}
                    <span className="text-accent font-medium">{editionRemaining} prints remaining</span>
                  </p>
                </div>
              )}

              {/* Price */}
              <div>
                <p className="text-3xl font-display text-primary">₹{total.toLocaleString('en-IN')}</p>
                <p className="text-primary-400 text-xs font-body mt-1">Base: ₹{photo.basePrice?.toLocaleString('en-IN')} · Updates live</p>
              </div>

              {/* ── CONFIGURATOR ─────────────────────────────────── */}
              <div className="space-y-6 border-t border-primary-100 pt-6">

                {/* Print Size */}
                {sizes.length > 0 && (
                  <div>
                    <p className="form-label">Print Size</p>
                    <div className="flex flex-wrap gap-2">
                      {sizes.map(s => (
                        <OptionBtn key={s.id} active={selectedSize?.id === s.id} onClick={() => setSelectedSize(s)}>
                          {s.label} {s.basePrice > 0 && <span className="text-xs opacity-60">+₹{s.basePrice.toLocaleString('en-IN')}</span>}
                        </OptionBtn>
                      ))}
                    </div>
                  </div>
                )}

                {/* Print Finish */}
                {finishes.length > 0 && (
                  <div>
                    <p className="form-label">Print Finish</p>
                    <div className="flex flex-wrap gap-2">
                      {finishes.map(f => (
                        <OptionBtn key={f.id} active={selectedFinish?.id === f.id} onClick={() => setSelectedFinish(f)}>
                          {f.name} {f.price > 0 && <span className="text-xs opacity-60">+₹{f.price.toLocaleString('en-IN')}</span>}
                        </OptionBtn>
                      ))}
                    </div>
                  </div>
                )}

                {/* Frame */}
                {frames.length > 0 && (
                  <div>
                    <p className="form-label">Frame</p>
                    <div className="flex flex-wrap gap-2">
                      <OptionBtn active={!selectedFrame} onClick={() => setSelectedFrame(null)}>
                        No Frame
                      </OptionBtn>
                      {frames.map(f => (
                        <OptionBtn key={f.id} active={selectedFrame?.id === f.id} onClick={() => setSelectedFrame(f)}>
                          <span className="flex items-center gap-2">
                            <span
                              className="w-3.5 h-3.5 rounded-full border border-primary-200 inline-block"
                              style={{ background: FRAME_COLORS[f.name] || '#999' }}
                            />
                            {f.name} ({f.material}) {f.price > 0 && <span className="text-xs opacity-60">+₹{f.price.toLocaleString('en-IN')}</span>}
                          </span>
                        </OptionBtn>
                      ))}
                    </div>
                  </div>
                )}

                {/* Glass */}
                {glassOpts.length > 0 && (
                  <div>
                    <p className="form-label">Glass</p>
                    <div className="flex flex-wrap gap-2">
                      {glassOpts.map(g => (
                        <OptionBtn key={g.id} active={selectedGlass?.id === g.id} onClick={() => setSelectedGlass(g)}>
                          {g.name} {g.price > 0 && <span className="text-xs opacity-60">+₹{g.price.toLocaleString('en-IN')}</span>}
                        </OptionBtn>
                      ))}
                    </div>
                  </div>
                )}

                {/* Mount */}
                {mountOpts.length > 0 && (
                  <div>
                    <p className="form-label">Mount</p>
                    <div className="flex flex-wrap gap-2">
                      {mountOpts.map(m => (
                        <OptionBtn key={m.id} active={selectedMount?.id === m.id} onClick={() => setSelectedMount(m)}>
                          {m.name} {m.price > 0 && <span className="text-xs opacity-60">+₹{m.price.toLocaleString('en-IN')}</span>}
                        </OptionBtn>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quantity */}
                <div>
                  <p className="form-label">Quantity</p>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setQty(q => Math.max(1, q - 1))}
                      className="w-10 h-10 border border-primary-200 flex items-center justify-center text-xl hover:border-accent transition-colors"
                    >−</button>
                    <span className="font-display text-2xl w-8 text-center">{qty}</span>
                    <button
                      onClick={() => setQty(q => q + 1)}
                      className="w-10 h-10 border border-primary-200 flex items-center justify-center text-xl hover:border-accent transition-colors"
                    >+</button>
                  </div>
                </div>

                {/* Price breakdown */}
                <div className="bg-primary-50 p-4 space-y-2 text-sm font-body">
                  <div className="flex justify-between text-primary-600">
                    <span>Base Print</span><span>₹{photo.basePrice?.toLocaleString('en-IN')}</span>
                  </div>
                  {selectedSize?.basePrice > 0 && (
                    <div className="flex justify-between text-primary-600">
                      <span>Size ({selectedSize.label})</span><span>+₹{selectedSize.basePrice.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  {selectedFinish?.price > 0 && (
                    <div className="flex justify-between text-primary-600">
                      <span>Finish ({selectedFinish.name})</span><span>+₹{selectedFinish.price.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  {selectedFrame && (
                    <div className="flex justify-between text-primary-600">
                      <span>Frame ({selectedFrame.name})</span><span>+₹{selectedFrame.price?.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  {selectedGlass?.price > 0 && (
                    <div className="flex justify-between text-primary-600">
                      <span>Glass ({selectedGlass.name})</span><span>+₹{selectedGlass.price.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  {selectedMount?.price > 0 && (
                    <div className="flex justify-between text-primary-600">
                      <span>Mount ({selectedMount.name})</span><span>+₹{selectedMount.price.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  {qty > 1 && (
                    <div className="flex justify-between text-primary-600">
                      <span>× {qty}</span><span></span>
                    </div>
                  )}
                  <div className="flex justify-between font-semibold text-primary border-t border-primary-200 pt-2 mt-2">
                    <span>Total</span><span>₹{total.toLocaleString('en-IN')}</span>
                  </div>
                  <p className="text-primary-400 text-xs mt-1">Production: 5–7 days · Dispatch in 7–10 days</p>
                </div>

                <button
                  onClick={handleWhatsApp}
                  className="w-full relative overflow-hidden flex items-center justify-between text-white bg-[#25D366] hover:bg-[#20ba5c] hover:scale-[1.02] transition-all duration-300 focus-visible:outline-2 focus-visible:outline-[#25D366] shadow-md hover:shadow-lg group"
                  style={{ height: '70px' }}
                >
                  {/* Left Side: Order text and icon */}
                  <div className="relative z-10 flex items-center gap-3 pl-6 font-body font-medium tracking-widest uppercase text-sm md:text-base">
                    <svg 
                      className="w-5 h-5 fill-current animate-pulse text-white transition-transform duration-300 group-hover:scale-110" 
                      viewBox="0 0 24 24" 
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.5-5.739-1.451L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.963C16.528 2.019 14.07 1 11.993 1c-5.442 0-9.87 4.372-9.874 9.802-.001 1.968.512 3.888 1.488 5.607l-.985 3.593 3.735-.98l.186.11zm11.378-7.904c-.285-.143-1.688-.836-1.95-.931-.262-.095-.453-.143-.644.143-.191.285-.738.931-.905 1.121-.167.19-.334.214-.619.071-.285-.143-1.204-.445-2.293-1.415-.848-.758-1.42-1.696-1.587-1.982-.167-.285-.018-.439.124-.58.128-.127.285-.334.429-.5.143-.167.19-.286.286-.476.095-.19.048-.357-.024-.5-.071-.143-.644-1.554-.882-2.126-.233-.558-.469-.482-.644-.491-.167-.008-.358-.01-.55-.01s-.502.072-.765.358c-.263.286-1.004.981-1.004 2.392s1.028 2.772 1.171 2.963c.143.19 2.023 3.1 4.899 4.343.684.296 1.218.473 1.635.605.687.218 1.312.187 1.806.114.55-.082 1.688-.692 1.926-1.36.238-.67.238-1.243.167-1.36-.071-.118-.262-.19-.548-.333z" />
                    </svg>
                    <span>Order on WhatsApp</span>
                  </div>
 
                  {/* Right Side: Loop Animation Background */}
                  <div className="absolute right-0 top-0 bottom-0 w-[45%] pointer-events-none overflow-hidden select-none z-0">
                    <div className="whatsapp-loop-wrapper">
                      <div className="whatsapp-mountain"></div>
                      <div className="whatsapp-hill"></div>
                      <div className="whatsapp-tree whatsapp-tree-1"></div>
                      <div className="whatsapp-tree whatsapp-tree-2"></div>
                      <div className="whatsapp-tree whatsapp-tree-3"></div>
                      <div className="whatsapp-rock"></div>
                      <div className="whatsapp-truck"></div>
                      <div className="whatsapp-wheels"></div>
                    </div>
                    {/* Feathered gradient blending overlay */}
                    <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-[#25D366] to-transparent z-10 pointer-events-none" />
                  </div>
                </button>
                <p className="text-center text-primary-400 text-xs font-body">
                  No online payment needed. We'll confirm your order via WhatsApp.
                </p>
              </div>
            </div>
          </div>

          {/* ── METADATA ─────────────────────────────────────────────────────── */}
          <div className="mt-20 grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Story */}
            <div className="lg:col-span-2 space-y-6">
              {photo.description && (
                <div>
                  <h2 className="font-display text-2xl text-primary mb-3">About This Photograph</h2>
                  <p className="text-primary-600 leading-relaxed">{photo.description}</p>
                </div>
              )}
              {photo.story && (
                <div>
                  <h3 className="font-display text-xl text-primary mb-3">The Story Behind the Shot</h3>
                  <p className="text-primary-600 leading-relaxed italic border-l-2 border-accent pl-4">{photo.story}</p>
                </div>
              )}
              {/* Tags */}
              {photo.tags?.length > 0 && (
                <div className="flex items-center gap-2 flex-wrap">
                  <Tag size={14} className="text-primary-300" />
                  {photo.tags.map(tag => (
                    <span key={tag} className="text-xs px-3 py-1 bg-primary-50 border border-primary-100 text-primary-600 font-body">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Technical Details */}
            <div className="bg-primary-50 p-6 space-y-4">
              <h3 className="font-display text-xl text-primary mb-4">Technical Details</h3>
              {[
                { icon: Camera, label: 'Camera', value: photo.camera },
                { label: 'Lens', value: photo.lens },
                { label: 'ISO', value: photo.iso },
                { icon: Aperture, label: 'Aperture', value: photo.aperture },
                { icon: Clock, label: 'Shutter Speed', value: photo.shutterSpeed },
                { label: 'Orientation', value: photo.orientation },
                { label: 'Resolution', value: photo.resolution },
                { icon: MapPin, label: 'Location', value: photo.location },
                { label: 'Date Taken', value: photo.dateTaken ? new Date(photo.dateTaken).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' }) : null },
              ].filter(d => d.value).map(d => (
                <div key={d.label} className="flex justify-between text-sm font-body border-b border-primary-100 pb-2">
                  <span className="text-primary-400 flex items-center gap-1.5">
                    {d.icon && <d.icon size={13} />} {d.label}
                  </span>
                  <span className="text-primary font-medium">{d.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── RELATED PHOTOS ────────────────────────────────────────────────── */}
          {related.length > 0 && (
            <div className="mt-20">
              <h2 className="section-heading text-3xl mb-10">Related Photographs</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {related.slice(0, 8).map(r => (
                  <Link key={r.id} to={`/photos/${r.slug}`} className="photo-card group block">
                    <div className="overflow-hidden aspect-[4/3]">
                      <motion.img
                        src={r.imageUrl}
                        alt={r.title}
                        className="w-full h-full object-cover no-drag no-select"
                        whileHover={{ scale: 1.06 }}
                        transition={{ duration: 0.5 }}
                        draggable={false}
                        onContextMenu={(e) => e.preventDefault()}
                      />
                    </div>
                    <div className="photo-card-overlay items-end">
                      <div className="p-4 w-full reveal-on-hover">
                        <p className="text-white font-display text-sm">{r.title}</p>
                        <p className="text-white/60 text-xs font-body">₹{r.basePrice?.toLocaleString('en-IN')}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PhotoDetailPage;
