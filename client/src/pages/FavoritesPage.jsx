import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, ArrowRight, Trash2 } from 'lucide-react';
import { photoService } from '../services/photoService';

const getFavIds = () => JSON.parse(localStorage.getItem('sikhar_favs') || '[]');
const removeFav = (id) => {
  const ids = getFavIds().filter(f => f !== id);
  localStorage.setItem('sikhar_favs', JSON.stringify(ids));
  return ids;
};

const FavoritesPage = () => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favIds, setFavIds] = useState(getFavIds());

  useEffect(() => {
    const load = async () => {
      if (favIds.length === 0) { setLoading(false); return; }
      try {
        // Fetch all published photos then filter by saved IDs client-side
        const res = await photoService.getAll({ limit: 200 });
        const all = res.data || [];
        setPhotos(all.filter(p => favIds.includes(p.id)));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
    window.scrollTo(0, 0);
  }, []);

  const handleRemove = (id) => {
    const next = removeFav(id);
    setFavIds(next);
    setPhotos(prev => prev.filter(p => p.id !== id));
  };

  return (
    <div className="pt-24 pb-20 min-h-screen bg-background">
      <div className="container-luxury">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-14"
        >
          <span className="text-accent text-xs tracking-[0.35em] uppercase font-body font-medium block mb-3">
            Your Collection
          </span>
          <div className="flex items-end justify-between gap-6 flex-wrap">
            <h1 className="section-heading text-4xl md:text-5xl">
              Saved Favourites
            </h1>
            <p className="text-primary-400 text-sm font-body">
              {photos.length} {photos.length === 1 ? 'print' : 'prints'} saved
            </p>
          </div>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="skeleton aspect-[4/3] rounded-none" />
            ))}
          </div>
        ) : photos.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-32"
          >
            <Heart size={48} className="text-primary-200 mx-auto mb-6" />
            <h2 className="font-display text-3xl text-primary mb-4">No saved prints yet</h2>
            <p className="text-primary-400 mb-8 font-body">
              Browse the portfolio and click the heart icon to save prints you love.
            </p>
            <Link to="/" className="btn-primary">
              Explore Portfolio <ArrowRight size={16} />
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {photos.map((photo, i) => (
              <motion.div
                key={photo.id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06, duration: 0.5 }}
                className="photo-card group relative"
              >
                <Link to={`/photos/${photo.slug}`}>
                  <div className="overflow-hidden aspect-[4/3]">
                    <motion.img
                      src={photo.imageUrl}
                      alt={photo.title}
                      className="w-full h-full object-cover no-drag no-select"
                      whileHover={{ scale: 1.06 }}
                      transition={{ duration: 0.5 }}
                      draggable={false}
                      onContextMenu={(e) => e.preventDefault()}
                    />
                  </div>
                  <div className="photo-card-overlay items-end">
                    <div className="p-4 w-full reveal-on-hover">
                      <p className="text-white font-display text-sm">{photo.title}</p>
                      <p className="text-white/60 text-xs font-body mt-0.5">
                        ₹{photo.basePrice?.toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>
                </Link>
                {/* Remove button */}
                <button
                  onClick={() => handleRemove(photo.id)}
                  className="absolute top-3 right-3 bg-white/90 hover:bg-red-500 hover:text-white text-primary p-2 opacity-0 group-hover:opacity-100 transition-all duration-200 z-10"
                  title="Remove from favourites"
                >
                  <Trash2 size={14} />
                </button>
                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
                  {photo.limitedEdition && <span className="badge-limited text-[10px]">Limited</span>}
                  {photo.bestSeller && <span className="badge-featured text-[10px]">Best Seller</span>}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {!loading && photos.length > 0 && (
          <div className="text-center mt-16">
            <Link to="/" className="btn-secondary">
              Explore More Prints <ArrowRight size={15} />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default FavoritesPage;
