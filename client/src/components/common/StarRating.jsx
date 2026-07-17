import React from 'react';
import { Star } from 'lucide-react';

export const StarRating = ({ rating, size = 16, className = "" }) => {
  return (
    <div className={`flex items-center gap-0.5 ${className}`}>
      {[...Array(5)].map((_, i) => (
        <Star 
          key={i} 
          size={size} 
          className={i < rating ? "fill-accent text-accent" : "text-gray-300"} 
        />
      ))}
    </div>
  );
};
