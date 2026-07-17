import React from 'react';
import { X, ArrowRight, ShieldCheck, Truck } from 'lucide-react';
import { Link } from 'react-router-dom';

const QuickPreviewModal = ({ frame, onClose }) => {
  if (!frame) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-primary/80 backdrop-blur-sm">
      <div className="relative bg-white w-full max-w-4xl rounded-2xl overflow-hidden shadow-luxury-lg max-h-[90vh] flex flex-col md:flex-row border border-[#eaeaea]">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-white/95 backdrop-blur-md text-primary hover:text-accent h-10 w-10 rounded-full flex items-center justify-center shadow-card border border-[#f1f1f1] transition-colors"
        >
          <X size={20} />
        </button>

        {/* Product Image */}
        <div className="md:w-1/2 bg-gray-50 flex items-center justify-center border-r border-[#eaeaea] overflow-hidden max-h-[40vh] md:max-h-none">
          <img 
            src={frame.imageUrl} 
            alt={frame.name} 
            className="w-full h-full object-cover"
          />
        </div>

        {/* Product Details */}
        <div className="md:w-1/2 p-8 overflow-y-auto space-y-6">
          <div>
            {frame.category && (
              <span className="text-[10px] tracking-widest text-accent font-bold uppercase block mb-1">
                {frame.category.name}
              </span>
            )}
            <h2 className="font-display text-2xl md:text-3xl font-bold text-primary">{frame.name}</h2>
            <div className="text-xs text-primary/40 mt-1 uppercase tracking-widest">
              {frame.material} &bull; {frame.thickness} Width
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-[10px] uppercase text-primary/40 tracking-widest block">Estimated Starting Cost</span>
            <div className="text-3xl font-display font-bold text-primary">
              ₹{(frame.basePrice).toLocaleString('en-IN')}
            </div>
            <p className="text-xs text-primary/40 leading-relaxed font-light">
              *Calculated based on standard 8×10 size. Custom glass, mounting or custom sizes will adjust the pricing in the configurator.
            </p>
          </div>

          <p className="text-primary/70 text-sm leading-relaxed font-light">
            {frame.description}
          </p>

          {/* Quick Specifications */}
          <div className="grid grid-cols-2 gap-4 border-t border-b border-[#f1f1f1] py-4 text-xs font-light">
            <div>
              <span className="text-primary/40 uppercase tracking-widest block mb-0.5">Colors available</span>
              <span className="font-medium text-primary">{frame.colors?.join(', ') || 'Standard'}</span>
            </div>
            <div>
              <span className="text-primary/40 uppercase tracking-widest block mb-0.5">Production Time</span>
              <span className="font-medium text-primary">{frame.productionDays} Business Days</span>
            </div>
          </div>

          {/* Assurances */}
          <div className="space-y-2.5 text-xs text-primary/60 font-light">
            <div className="flex items-center gap-2">
              <ShieldCheck size={16} className="text-accent" />
              <span>Premium acid-free museum-grade backing board.</span>
            </div>
            <div className="flex items-center gap-2">
              <Truck size={16} className="text-accent" />
              <span>Secure shipping or direct studio pick-up options.</span>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <Link 
              to={`/configure?frame=${frame.slug}`}
              className="flex-1 bg-primary hover:bg-accent text-white hover:text-primary py-3.5 px-6 rounded-full text-center text-xs font-semibold tracking-widest uppercase transition-all duration-300 shadow-luxury"
            >
              Configure Frame
            </Link>
            <Link 
              to={`/frames/${frame.slug}`}
              className="border border-primary/20 hover:border-primary text-primary py-3.5 px-6 rounded-full text-center text-xs font-semibold tracking-widest uppercase transition-all duration-300"
            >
              Full Details
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickPreviewModal;
