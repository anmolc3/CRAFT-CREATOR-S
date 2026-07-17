import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShieldCheck, Truck, Clock, Palette, Ruler, MessageSquare, ArrowLeft } from 'lucide-react';
import { frameService } from '../services/frameService';
import { StarRating } from '../components/common/StarRating';
import { DetailSkeleton } from '../components/common/SkeletonLoader';
import { WhatsAppIcon } from '../components/common/WhatsAppButton';

const FrameDetailPage = () => {
  const { slug } = useParams();
  const [frame, setFrame] = useState(null);
  const [activeImage, setActiveImage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    frameService.getFrameBySlug(slug)
      .then(res => {
        const data = res.data.data;
        setFrame(data);
        setActiveImage(data.imageUrl);
        // Track visual analytics view
        frameService.trackEvent({ event: 'frame_view', frameId: data.id, meta: { slug } });
      })
      .catch(err => console.error('Error loading frame detail page:', err))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <DetailSkeleton />;
  if (!frame) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-20 text-center space-y-4">
        <h2 className="font-display text-2xl font-bold">Frame design not found</h2>
        <Link to="/frames" className="text-accent hover:underline text-sm">&larr; Back to collection</Link>
      </div>
    );
  }

  const imagesList = [frame.imageUrl, ...(frame.galleryImages || [])];

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-20">
      
      {/* Back button */}
      <div>
        <Link 
          to="/frames" 
          className="inline-flex items-center gap-2 text-primary/60 hover:text-primary text-xs font-semibold uppercase tracking-wider transition-colors"
        >
          <ArrowLeft size={14} /> Back to Catalog
        </Link>
      </div>

      {/* Main showcase area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        
        {/* Images Gallery */}
        <div className="space-y-4">
          <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-gray-50 border border-[#eaeaea] shadow-card">
            <img 
              src={activeImage} 
              alt={frame.name} 
              className="w-full h-full object-cover"
            />
          </div>

          {imagesList.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {imagesList.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImage(img)}
                  className={`h-20 w-20 rounded-xl overflow-hidden border-2 bg-gray-50 flex-shrink-0 transition-all ${
                    activeImage === img ? 'border-accent scale-95 shadow-inner' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`${frame.name} view ${index + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Detailed Specs Panel */}
        <div className="space-y-6">
          <div>
            {frame.category && (
              <span className="text-[10px] tracking-widest text-accent font-bold uppercase block mb-1">
                {frame.category.name}
              </span>
            )}
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-primary tracking-wide">
              {frame.name}
            </h1>
            <div className="flex items-center gap-4 mt-2 text-xs text-primary/40 font-light">
              <span>{frame.material} Material</span>
              <span>&bull;</span>
              <span>{frame.thickness} thickness</span>
            </div>
          </div>

          <div className="space-y-1 py-4 border-t border-b border-[#eaeaea]">
            <span className="text-[10px] uppercase text-primary/40 tracking-widest block font-semibold">Estimated starting price</span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-display font-bold text-primary">₹{(frame.basePrice).toLocaleString('en-IN')}</span>
              <span className="text-xs text-primary/40">*Includes basic sizes (8×10)</span>
            </div>
          </div>

          <p className="text-primary/75 text-sm sm:text-base leading-relaxed font-light">
            {frame.description}
          </p>

          {/* Configuration Summary Specifications */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-gray-50 p-6 rounded-2xl border border-gray-100 text-xs leading-relaxed font-light">
            <div className="flex gap-3 items-start">
              <Palette className="text-accent flex-shrink-0 mt-0.5" size={18} />
              <div>
                <span className="font-semibold text-primary uppercase block tracking-wider mb-0.5">Finishes available</span>
                <span className="text-primary/75">{frame.colors?.join(', ') || 'Natural finish'}</span>
              </div>
            </div>

            <div className="flex gap-3 items-start">
              <Ruler className="text-accent flex-shrink-0 mt-0.5" size={18} />
              <div>
                <span className="font-semibold text-primary uppercase block tracking-wider mb-0.5">Compatible sizes</span>
                <span className="text-primary/75">{frame.availableSizes?.join(', ') || 'All standard framing sizes'}</span>
              </div>
            </div>

            <div className="flex gap-3 items-start">
              <Clock className="text-accent flex-shrink-0 mt-0.5" size={18} />
              <div>
                <span className="font-semibold text-primary uppercase block tracking-wider mb-0.5">Production speed</span>
                <span className="text-primary/75">Ships in {frame.productionDays} working days</span>
              </div>
            </div>

            <div className="flex gap-3 items-start">
              <ShieldCheck className="text-accent flex-shrink-0 mt-0.5" size={18} />
              <div>
                <span className="font-semibold text-primary uppercase block tracking-wider mb-0.5">Conservation</span>
                <span className="text-primary/75">Acid-free mount backing boards</span>
              </div>
            </div>
          </div>

          {/* Quick buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Link 
              to={`/configure?frame=${frame.slug}`}
              className="flex-1 bg-primary hover:bg-accent text-white hover:text-primary py-4 px-8 rounded-full text-center text-xs font-semibold tracking-widest uppercase transition-all duration-300 shadow-luxury"
            >
              Start Custom Framing
            </Link>
            <a
              href={`https://wa.me/918077037277?text=Hello%2C%20I%20am%20interested%20in%20ordering%20the%20${encodeURIComponent(frame.name)}%20custom%20frame.`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 bg-[#25D366] hover:bg-[#20ba5a] text-white py-4 px-8 rounded-full text-center text-xs font-semibold tracking-widest uppercase transition-all duration-300 flex items-center justify-center gap-2"
            >
              <WhatsAppIcon /> Inquire via WhatsApp
            </a>
          </div>
        </div>
      </div>

      {/* Reviews Tab */}
      <div className="border-t border-[#eaeaea] pt-12 space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl font-bold text-primary flex items-center gap-2">
            <MessageSquare className="text-accent" size={20} />
            Customer Reviews ({frame.reviews?.length || 0})
          </h2>
        </div>

        {frame.reviews && frame.reviews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {frame.reviews.map((rev) => (
              <div key={rev.id} className="p-6 bg-gray-50 border border-gray-100 rounded-2xl space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-xs text-primary">{rev.customerName}</h4>
                  <span className="text-[10px] text-primary/40 font-light">
                    {new Date(rev.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}
                  </span>
                </div>
                <StarRating rating={rev.rating} />
                <p className="text-primary/75 text-xs font-light leading-relaxed">
                  "{rev.comment}"
                </p>
                {rev.verified && (
                  <span className="inline-flex items-center gap-1 text-[9px] text-[#25D366] font-semibold uppercase tracking-wider">
                    &bull; Verified framing customer
                  </span>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-primary/40 font-light text-xs italic">No reviews have been posted for this frame yet.</p>
        )}
      </div>

      {/* Related Frame Designs */}
      {frame.related && frame.related.length > 0 && (
        <div className="border-t border-[#eaeaea] pt-12 space-y-8">
          <h2 className="font-display text-2xl font-bold text-primary">Related Frame Designs</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {frame.related.map((rel) => (
              <div 
                key={rel.id} 
                className="bg-white rounded-2xl overflow-hidden border border-[#eaeaea] group flex flex-col justify-between shadow-card hover:shadow-card-hover transition-all duration-300"
              >
                <div className="aspect-[4/3] overflow-hidden bg-gray-50 border-b border-[#f1f1f1]">
                  <img 
                    src={rel.imageUrl} 
                    alt={rel.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                </div>
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-display text-base font-bold text-primary truncate hover:text-accent">
                      <Link to={`/frames/${rel.slug}`}>{rel.name}</Link>
                    </h3>
                    <p className="text-xs text-primary/50 font-light">{rel.material} &bull; {rel.thickness}</p>
                  </div>
                  <div className="pt-4 flex justify-between items-center border-t border-[#f5f5f5] mt-4">
                    <span className="font-display font-bold text-sm text-primary">Starting ₹{rel.basePrice}</span>
                    <Link to={`/frames/${rel.slug}`} className="text-accent hover:underline text-[10px] uppercase font-bold tracking-widest">
                      Details &rarr;
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

export default FrameDetailPage;
