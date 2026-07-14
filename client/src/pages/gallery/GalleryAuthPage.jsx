import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { clientGalleryService } from '../../services/clientGalleryService';

const GalleryAuthPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await clientGalleryService.verifyAndGet(slug, password);
      if (response.success) {
        // Store the gallery data temporarily in state/sessionStorage and navigate
        sessionStorage.setItem(`gallery_${slug}`, JSON.stringify(response.data));
        navigate(`/gallery/${slug}/view`);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Access denied. Please check your password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background styling */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-primary z-10" />
        <div className="absolute w-[800px] h-[800px] bg-accent/5 rounded-full blur-[120px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="luxury-card glass-dark p-8 md:p-12 max-w-md w-full relative z-20 text-center"
      >
        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-6">
          <Lock className="text-accent" size={28} />
        </div>
        
        <h1 className="font-display text-3xl text-white mb-2">Private Gallery</h1>
        <p className="text-white/60 font-light mb-8 text-sm">
          Please enter your client password to access this secure gallery.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded">
              {error}
            </div>
          )}

          <div>
            <input 
              type="password"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white placeholder-white/30 text-center focus:outline-none focus:border-accent transition-colors"
              required
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="btn-gold w-full"
          >
            {loading ? 'Verifying...' : 'Access Gallery'}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default GalleryAuthPage;
