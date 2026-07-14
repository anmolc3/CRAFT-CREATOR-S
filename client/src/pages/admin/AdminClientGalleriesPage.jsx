import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash, Lock, Unlock, Eye, Image as ImageIcon } from 'lucide-react';
import { clientGalleryService } from '../../services/clientGalleryService';

const AdminClientGalleriesPage = () => {
  const [galleries, setGalleries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGalleries();
  }, []);

  const fetchGalleries = async () => {
    try {
      const { data } = await clientGalleryService.getAll();
      setGalleries(data || []);
    } catch (error) {
      console.error('Error fetching galleries', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this gallery? This action cannot be undone and will delete all associated images.')) return;
    try {
      await clientGalleryService.delete(id);
      setGalleries(galleries.filter(g => g.id !== id));
    } catch (error) {
      console.error('Error deleting gallery', error);
      alert('Failed to delete gallery');
    }
  };

  if (loading) return <div className="text-white p-8">Loading client galleries...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-display text-white mb-1">Client Galleries</h2>
          <p className="text-gray-400 text-sm">Manage private photo collections for your clients.</p>
        </div>
        <button 
          onClick={() => alert('Add Gallery Modal would open here')}
          className="btn-gold flex items-center gap-2"
        >
          <Plus size={18} /> New Gallery
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {galleries.map((gallery) => (
          <div key={gallery.id} className="bg-[#1a1a1a] rounded-xl border border-[#2a2a2a] overflow-hidden flex flex-col">
            <div className="aspect-[16/9] relative bg-[#222]">
              {gallery.coverImage ? (
                <img src={gallery.coverImage} alt={gallery.title} className="w-full h-full object-cover opacity-80" />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <ImageIcon size={32} className="text-gray-600" />
                </div>
              )}
              <div className="absolute top-3 right-3 flex gap-2">
                <span className="bg-black/60 backdrop-blur-md px-2.5 py-1 rounded text-xs text-white font-medium flex items-center gap-1.5">
                  <ImageIcon size={12} /> {gallery._count?.images || 0}
                </span>
                <span className={`bg-black/60 backdrop-blur-md px-2.5 py-1 rounded text-xs font-medium flex items-center gap-1.5 ${
                  gallery.status === 'active' ? 'text-green-400' : 'text-gray-400'
                }`}>
                  {gallery.status === 'active' ? <Eye size={12} /> : <Eye size={12} className="opacity-50" />}
                  {gallery.status}
                </span>
              </div>
            </div>
            
            <div className="p-5 flex-1 flex flex-col">
              <h3 className="text-white font-display text-lg mb-1">{gallery.title}</h3>
              <p className="text-gray-400 text-sm mb-4">Client: {gallery.clientName}</p>
              
              <div className="mt-auto space-y-3">
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span className="flex items-center gap-1.5">
                    {gallery.password ? <Lock size={12} className="text-accent" /> : <Unlock size={12} />}
                    {gallery.password ? 'Protected' : 'Public'}
                  </span>
                  <span>
                    Expires: {gallery.expiryDate ? new Date(gallery.expiryDate).toLocaleDateString() : 'Never'}
                  </span>
                </div>
                
                <div className="pt-4 border-t border-[#2a2a2a] flex items-center justify-between">
                  <button 
                    onClick={() => window.open(`/gallery/${gallery.slug}`, '_blank')}
                    className="text-xs text-accent hover:text-white transition-colors"
                  >
                    View Gallery
                  </button>
                  <div className="flex items-center gap-3">
                    <button className="text-gray-400 hover:text-white transition-colors">
                      <Edit size={16} />
                    </button>
                    <button 
                      onClick={() => handleDelete(gallery.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {galleries.length === 0 && (
          <div className="col-span-full p-12 text-center border border-dashed border-[#333] rounded-xl bg-[#1a1a1a]/50">
            <h3 className="text-white font-medium mb-2">No Client Galleries</h3>
            <p className="text-gray-500 text-sm mb-6 max-w-md mx-auto">
              Create secure, beautiful private galleries to share photoshoots with your clients.
            </p>
            <button 
              onClick={() => alert('Add Gallery Modal would open here')}
              className="btn-gold mx-auto"
            >
              <Plus size={18} /> Create First Gallery
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminClientGalleriesPage;
