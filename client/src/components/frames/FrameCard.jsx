import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Eye } from 'lucide-react';

const FrameCard = ({ frame, onQuickPreview }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover border border-[#eaeaea] group flex flex-col justify-between transition-all duration-500 h-full"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-50 border-b border-[#f1f1f1]">
        <img 
          src={frame.imageUrl} 
          alt={frame.name}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          loading="lazy"
        />
        
        {/* Floating Category Tag */}
        {frame.category && (
          <span className="absolute top-4 left-4 bg-primary/90 backdrop-blur-md text-white text-[10px] tracking-widest uppercase px-3 py-1.5 rounded-full font-semibold">
            {frame.category.name}
          </span>
        )}

        {/* Hover action overlay */}
        <div className="absolute inset-0 bg-primary/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
          <button 
            onClick={() => onQuickPreview(frame)}
            className="bg-white text-primary hover:bg-accent hover:text-primary h-11 w-11 rounded-full flex items-center justify-center shadow-luxury transition-all duration-300 hover:scale-105"
            title="Quick Preview"
          >
            <Eye size={18} />
          </button>
          <Link 
            to={`/frames/${frame.slug}`}
            className="bg-white text-primary hover:bg-accent hover:text-primary h-11 w-11 rounded-full flex items-center justify-center shadow-luxury transition-all duration-300 hover:scale-105"
            title="View Details"
          >
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>

      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          <div className="text-[10px] tracking-widest text-accent font-bold uppercase mb-1">
            {frame.material} &bull; {frame.thickness} Thick
          </div>
          <h3 className="font-display text-xl font-bold text-primary group-hover:text-accent transition-colors">
            <Link to={`/frames/${frame.slug}`}>{frame.name}</Link>
          </h3>
          <p className="text-primary/60 text-xs mt-2 line-clamp-2 leading-relaxed">
            {frame.description}
          </p>
        </div>

        <div className="pt-6 flex justify-between items-center border-t border-[#f5f5f5] mt-6">
          <div>
            <span className="text-[10px] uppercase text-primary/40 tracking-widest block">Starting at</span>
            <span className="font-display text-lg font-bold text-primary">₹{(frame.basePrice).toLocaleString('en-IN')}</span>
          </div>
          
          <Link 
            to={`/configure?frame=${frame.slug}`}
            className="bg-primary hover:bg-accent text-white hover:text-primary px-5 py-2.5 rounded-full text-[10px] font-semibold tracking-widest uppercase transition-all duration-300 shadow-luxury"
          >
            Frame Now
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default FrameCard;
