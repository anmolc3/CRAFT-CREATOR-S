import React from 'react';
import { Link } from 'react-router-dom';
import { HelpCircle } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="max-w-7xl mx-auto px-6 py-24 text-center space-y-6 min-h-[70vh] flex flex-col justify-center items-center">
      <div className="h-16 w-16 bg-accent/10 text-accent rounded-full flex items-center justify-center text-2xl font-bold">
        404
      </div>
      <h1 className="font-display text-3xl sm:text-5xl font-bold text-primary">Page Not Found</h1>
      <p className="text-primary/60 text-xs sm:text-sm font-light max-w-sm mx-auto leading-relaxed">
        The custom framing page you are looking for does not exist. It might have been moved or renamed.
      </p>
      <div className="pt-4 flex gap-4">
        <Link 
          to="/"
          className="bg-primary hover:bg-accent text-white hover:text-primary py-3 px-6 rounded-full text-xs font-semibold tracking-widest uppercase transition-all shadow-luxury"
        >
          Return Home
        </Link>
        <Link 
          to="/frames"
          className="border border-primary/20 hover:border-primary text-primary py-3 px-6 rounded-full text-xs font-semibold tracking-widest uppercase transition-all"
        >
          Catalog Directory
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
