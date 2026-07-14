import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Heart } from 'lucide-react';
import { collectionService } from '../services/collectionService';
import { photoService } from '../services/photoService';

const getFavIds = () => JSON.parse(localStorage.getItem('sikhar_favs') || '[]');
const toggleFav = (id) => {
  const favs = getFavIds();
  const next = favs.includes(id) ? favs.filter(f => f !== id) : [...favs, id];
  localStorage.setItem('sikhar_favs', JSON.stringify(next));
  return next.includes(id);
};

const CollectionDetailPage = () => {
  const { slug } = useParams();
  const [collection, setCollection] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favIds, setFavIds] = useState(getFavIds());

  useEffect(() => {
    const load = async () => {
      try {
        const colRes = await collectionService.getBySlug(slug);
        setCollection(colRes.data);
        const photoRes = await photoService.getAll({ collection: slug, limit: 100, status: 'published' });
        setPhotos(photoRes.data || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
    window.scrollTo(0, 0);
  }, [slug]);

  const handleFav = (id) => {
    const next = toggleFav(id);
    setFavIds(next ? [...favIds, id] : favIds.filter(f => f !== id));
  };

  if (loading) {
    return (
      <div className="pt-24 pb-20">
        <div className="skeleton h-64 w-full mb-12" />
        <div className="container-luxury grid grid-cols-2 md:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => <div key={i} className="skeleton aspect-[4/3]" />)}
        </div>
      </div>
    );
  }

  if (!collection) {
    return (
      <div className="pt-40 text-center">
        <h1 className="font-display text-3xl mb-4">Collection Not Found</h1>
        <Link to="/" className="btn-primary">Back to Home</Link>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen">
      {/* Hero Banner */}
      <div className="relative h-72 md:h-96 overflow-hidden">
        {collection.imageUrl ? (
          <img src={collection.imageUrl} alt={collection.name} className="w-full h-full object-cover no-drag" draggable={false} onContextMenu={e => e.preventDefault()} />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary to-secondary" />
        )}
        <div className="absolute inset-0 bg-black/55" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-6">
          <motion.span
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
            className="text-accent text-xs tracking-[0.4em] uppercase font-body mb-3"
          >
            Collection
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-5xl md:text-7xl"
          >
            {collection.name}
          </motion.h1>
          {collection.description && (
            <motion.p
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
              className="text-white/70 text-base md:text-lg max-w-2xl mt-4 font-light"
            >
              {collection.description}
            </motion.p>
          )}
          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
            className="text-white/40 text-sm mt-3 font-body"
          >
            {photos.length} {photos.length === 1 ? 'photograph' : 'photographs'}
          </motion.p>
        </div>
      </div>

      {/* Photo Grid */}
      <div className="container-luxury py-20">
        {photos.length === 0 ? (
          <div className="text-center py-20">
            <p className="font-display text-2xl text-primary mb-4">No photographs in this collection yet.</p>
            <Link to="/" className="btn-secondary">Explore Portfolio <ArrowRight size={15} /></Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {photos.map((photo, i) => (
              <motion.div
                key={photo.id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05, duration: 0.5 }}
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
                      <p className="text-white/60 text-xs font-body mt-0.5">₹{photo.basePrice?.toLocaleString('en-IN')}</p>
                    </div>
                  </div>
                </Link>
                {/* Fav button */}
                <button
                  onClick={() => handleFav(photo.id)}
                  className={`absolute top-3 right-3 p-2 transition-all duration-200 z-10 opacity-0 group-hover:opacity-100 ${
                    favIds.includes(photo.id) ? 'bg-white text-red-500 opacity-100' : 'bg-white/80 hover:bg-white text-primary'
                  }`}
                >
                  <Heart size={14} fill={favIds.includes(photo.id) ? 'currentColor' : 'none'} />
                </button>
                {photo.limitedEdition && (
                  <span className="absolute top-3 left-3 badge-limited text-[10px] z-10">Limited</span>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CollectionDetailPage;
