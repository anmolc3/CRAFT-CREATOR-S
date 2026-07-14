import React, { useEffect, useState } from 'react';
import { analyticsService } from '../../services/analyticsService';
import { Camera, Star, Flame, Eye, MessageSquare, Heart, RefreshCw } from 'lucide-react';

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      setLoading(true);
      const res = await analyticsService.getSummary();
      setData(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  if (loading) {
    return (
      <div className="p-8 space-y-6">
        <div className="flex justify-between items-center">
          <div className="skeleton h-8 w-48" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="skeleton h-32 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  const { summary, recentUploads = [], popularCategories = [], popularCollections = [], mostViewedPhotos = [] } = data || {};

  return (
    <div className="p-8 space-y-10">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-display text-white">Dashboard Overview</h2>
          <p className="text-gray-400 text-sm mt-1">Live metrics and store analytics</p>
        </div>
        <button onClick={load} className="p-2 border border-[#333] hover:border-gray-500 rounded text-gray-400 hover:text-white transition-colors">
          <RefreshCw size={16} />
        </button>
      </div>

      {/* Grid Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-[#1a1a1a] p-6 rounded-xl border border-[#2a2a2a] flex items-center justify-between">
          <div>
            <div className="text-gray-400 text-sm mb-1">Total Photos</div>
            <div className="text-3xl text-white font-display font-medium">{summary?.totalPhotos || 0}</div>
          </div>
          <Camera className="text-accent/60" size={32} />
        </div>

        <div className="bg-[#1a1a1a] p-6 rounded-xl border border-[#2a2a2a] flex items-center justify-between">
          <div>
            <div className="text-gray-400 text-sm mb-1">Featured Photos</div>
            <div className="text-3xl text-white font-display font-medium">{summary?.featuredPhotos || 0}</div>
          </div>
          <Star className="text-yellow-500/60" size={32} />
        </div>

        <div className="bg-[#1a1a1a] p-6 rounded-xl border border-[#2a2a2a] flex items-center justify-between">
          <div>
            <div className="text-gray-400 text-sm mb-1">Best Sellers</div>
            <div className="text-3xl text-white font-display font-medium">{summary?.bestSellers || 0}</div>
          </div>
          <Flame className="text-orange-500/60" size={32} />
        </div>

        <div className="bg-[#1a1a1a] p-6 rounded-xl border border-[#2a2a2a] flex items-center justify-between">
          <div>
            <div className="text-gray-400 text-sm mb-1">Views</div>
            <div className="text-3xl text-white font-display font-medium">{summary?.totalViews || 0}</div>
          </div>
          <Eye className="text-blue-500/60" size={32} />
        </div>

        <div className="bg-[#1a1a1a] p-6 rounded-xl border border-[#2a2a2a] flex items-center justify-between">
          <div>
            <div className="text-gray-400 text-sm mb-1">WhatsApp Clicks</div>
            <div className="text-3xl text-accent font-display font-medium">{summary?.whatsappClicks || 0}</div>
          </div>
          <MessageSquare className="text-accent/60" size={32} />
        </div>

        <div className="bg-[#1a1a1a] p-6 rounded-xl border border-[#2a2a2a] flex items-center justify-between">
          <div>
            <div className="text-gray-400 text-sm mb-1">Favorites Count</div>
            <div className="text-3xl text-white font-display font-medium">{summary?.favoritesCount || 0}</div>
          </div>
          <Heart className="text-red-500/60" size={32} fill="currentColor" />
        </div>
      </div>

      {/* Row breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Most Viewed */}
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] p-6 rounded-xl">
          <h3 className="text-lg font-display text-white mb-4">Most Viewed Photos</h3>
          <div className="space-y-4">
            {mostViewedPhotos.map(photo => (
              <div key={photo.id} className="flex items-center justify-between border-b border-[#2a2a2a] pb-3 last:border-0 last:pb-0">
                <div className="flex items-center gap-3">
                  <img src={photo.imageUrl} alt="" className="w-12 h-10 object-cover rounded bg-[#2a2a2a]" />
                  <div>
                    <p className="text-sm font-medium text-white">{photo.title}</p>
                    <p className="text-xs text-gray-500">{photo.category?.name || 'No Category'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-gray-400">
                  <Eye size={12} /> {photo.views || 0}
                </div>
              </div>
            ))}
            {mostViewedPhotos.length === 0 && <p className="text-gray-500 text-sm text-center py-6">No view stats recorded yet.</p>}
          </div>
        </div>

        {/* Popular Categories & Collections */}
        <div className="space-y-8">
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] p-6 rounded-xl">
            <h3 className="text-lg font-display text-white mb-4">Popular Categories</h3>
            <div className="space-y-3">
              {popularCategories.map(cat => (
                <div key={cat.id} className="flex justify-between items-center text-sm font-body">
                  <span className="text-gray-300">{cat.name}</span>
                  <span className="text-xs px-2.5 py-1 rounded bg-[#2a2a2a] text-gray-400">
                    {cat._count?.photos || 0} photos
                  </span>
                </div>
              ))}
              {popularCategories.length === 0 && <p className="text-gray-500 text-sm text-center">No categories.</p>}
            </div>
          </div>

          <div className="bg-[#1a1a1a] border border-[#2a2a2a] p-6 rounded-xl">
            <h3 className="text-lg font-display text-white mb-4">Popular Collections</h3>
            <div className="space-y-3">
              {popularCollections.map(col => (
                <div key={col.id} className="flex justify-between items-center text-sm font-body">
                  <span className="text-gray-300">{col.name}</span>
                  <span className="text-xs px-2.5 py-1 rounded bg-[#2a2a2a] text-gray-400">
                    {col._count?.photos || 0} photos
                  </span>
                </div>
              ))}
              {popularCollections.length === 0 && <p className="text-gray-500 text-sm text-center">No collections.</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
