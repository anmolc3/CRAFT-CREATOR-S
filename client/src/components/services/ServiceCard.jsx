import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const ServiceCard = ({ service }) => {
  return (
    <motion.div 
      className="group relative overflow-hidden bg-white luxury-card"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <div className="aspect-[4/3] overflow-hidden relative">
        <img 
          src={service.heroImage || '/sample.png'} 
          alt={service.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent flex items-end p-6">
          <span className="text-white/80 font-body text-xs uppercase tracking-widest font-medium">
            {service.duration || 'Custom Duration'}
          </span>
        </div>
      </div>
      
      <div className="p-8">
        <h3 className="text-2xl font-display text-primary mb-3 group-hover:text-accent transition-colors">
          {service.title}
        </h3>
        <p className="text-primary-600 mb-6 line-clamp-3 text-sm leading-relaxed">
          {service.description}
        </p>
        
        <div className="flex items-center justify-between mt-auto">
          <span className="font-display text-lg text-primary font-medium">
            {service.price > 0 ? `From ₹${service.price.toLocaleString('en-IN')}` : 'Contact for pricing'}
          </span>
          <Link 
            to={`/services/${service.slug}`}
            className="inline-flex items-center justify-center w-10 h-10 rounded-full border border-primary/20 text-primary transition-all duration-300 group-hover:bg-accent group-hover:border-accent group-hover:text-white"
          >
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default ServiceCard;
