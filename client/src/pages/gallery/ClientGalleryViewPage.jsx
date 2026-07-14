import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Heart, X, ZoomIn } from 'lucide-react';

const ClientGalleryViewPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [gallery, setGallery] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [lightboxIndex, setLightboxIndex] = useState(null);

  useEffect(() => {
    // Check if gallery is authorized via sessionStorage
    const storedGallery = sessionStorage.getItem(`gallery_${slug}`);
    if (!storedGallery) {
      navigate(`/gallery/${slug}`);
      return;
    }
    
    const parsedGallery = JSON.parse(storedGallery);
    setGallery(parsedGallery);
    
    // Load local favorites for this gallery
    const localFavs = localStorage.getItem(`favs_${parsedGallery.id}`);
    if (localFavs) {
      setFavorites(JSON.parse(localFavs));
    }

    // Prevent context menu to protect images
    const handleContextMenu = (e) => e.preventDefault();
    document.addEventListener('contextmenu', handleContextMenu);
    return () => document.removeEventListener('contextmenu', handleContextMenu);
  }, [slug, navigate]);

  const toggleFavorite = (imageId) => {
    let newFavs;
    if (favorites.includes(imageId)) {
      newFavs = favorites.filter(id => id !== imageId);
    } else {
      newFavs = [...favorites, imageId];
    }
    setFavorites(newFavs);
    if (gallery) {
      localStorage.setItem(`favs_${gallery.id}`, JSON.stringify(newFavs));
    }
  };

  const downloadImage = async (url, filename) => {
    if (!gallery?.downloadsEnabled) return;
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = filename || 'download.jpg';
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('Download failed', error);
    }
  };

  if (!gallery) return null;

  return (
    <div className="min-h-screen bg-background pt-20">
      {/* Gallery Header */}
      <div className="bg-white border-b border-primary-100 py-12 px-4">
        <div className="container-luxury text-center max-w-3xl mx-auto">
          <span className="text-accent uppercase tracking-widest text-xs font-medium mb-3 block">
            {gallery.eventName || 'Private Collection'}
          </span>
          <h1 className="font-display text-4xl text-primary mb-4">{gallery.title}</h1>
          <p className="text-primary-600 font-light">{gallery.description}</p>
          <div className="mt-6 text-sm text-primary-400 font-body">
            Prepared exclusively for {gallery.clientName}
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="sticky top-16 z-30 bg-white/80 backdrop-blur-md border-b border-primary-100 py-3 px-4">
        <div className="container-luxury flex items-center justify-between">
          <div className="text-sm font-body text-primary-600">
            {gallery.images.length} Images • {favorites.length} Favorites
          </div>
          <div className="flex items-center gap-4">
            {gallery.downloadsEnabled && (
              <button 
                onClick={() => alert('Batch downloading requires backend zip generation. Not implemented in demo.')}
                className="text-primary hover:text-accent flex items-center gap-2 text-sm uppercase tracking-widest font-medium transition-colors"
              >
                <Download size={16} /> Download All
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Masonry Grid */}
      <div className="container-luxury py-12">
        <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
          {gallery.images.map((img, index) => (
            <div 
              key={img.id} 
              className="break-inside-avoid relative group overflow-hidden bg-primary-50 cursor-pointer protect-image"
            >
              <img 
                src={img.watermarkUrl || img.imageUrl} 
                alt="Gallery preview"
                className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105 pointer-events-auto"
                onClick={() => setLightboxIndex(index)}
              />
              
              <div className="absolute inset-0 bg-gradient-to-t from-primary/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              
              <div className="absolute top-4 right-4 z-10 flex flex-col gap-2 pointer-events-auto">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(img.id);
                  }}
                  className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white hover:text-red-500 transition-all duration-300"
                >
                  <Heart size={18} className={favorites.includes(img.id) ? 'fill-red-500 text-red-500' : ''} />
                </button>
              </div>

              <div className="absolute bottom-4 right-4 z-10 pointer-events-auto">
                {gallery.downloadsEnabled && (
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      downloadImage(img.imageUrl, `gallery-${index + 1}.jpg`);
                    }}
                    className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white hover:text-primary transition-all duration-300"
                  >
                    <Download size={18} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-primary/95 backdrop-blur-sm flex items-center justify-center protect-image"
          >
            <button 
              onClick={() => setLightboxIndex(null)}
              className="absolute top-6 right-6 text-white/50 hover:text-white pointer-events-auto z-50 transition-colors"
            >
              <X size={32} />
            </button>

            <div className="relative w-full max-w-7xl h-full flex items-center justify-center p-4">
              <img 
                src={gallery.images[lightboxIndex].watermarkUrl || gallery.images[lightboxIndex].imageUrl} 
                alt="Fullscreen view"
                className="max-w-full max-h-[90vh] object-contain select-none"
              />
            </div>

            {/* Lightbox Controls */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-8 pointer-events-auto">
              <button 
                onClick={() => setLightboxIndex(prev => (prev > 0 ? prev - 1 : gallery.images.length - 1))}
                className="text-white/50 hover:text-white uppercase tracking-widest text-sm transition-colors"
              >
                Prev
              </button>
              <span className="text-white/30 font-body text-sm">
                {lightboxIndex + 1} / {gallery.images.length}
              </span>
              <button 
                onClick={() => setLightboxIndex(prev => (prev < gallery.images.length - 1 ? prev + 1 : 0))}
                className="text-white/50 hover:text-white uppercase tracking-widest text-sm transition-colors"
              >
                Next
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ClientGalleryViewPage;
