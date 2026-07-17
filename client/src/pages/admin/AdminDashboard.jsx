import React, { useEffect, useState } from 'react';
import { analyticsService } from '../../services/analyticsService';
import { Film, Star, MessageSquare, Mail, RefreshCw, Eye, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      setLoading(true);
      const res = await analyticsService.getDashboardStats();
      setData(res.data.data);
    } catch (e) {
      console.error('Error fetching dashboard summary:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-white/5 animate-pulse rounded-lg" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-white/5 animate-pulse rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  const {
    totalFrames = 0,
    featuredFrames = 0,
    totalInquiries = 0,
    inquiryBreakdown = {},
    totalSubscribers = 0,
    whatsappClicks = 0,
    recentInquiries = [],
    popularFrames = []
  } = data || {};

  return (
    <div className="space-y-10">
      
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-display text-white font-bold tracking-wide">Dashboard Summary</h2>
          <p className="text-gray-400 text-xs mt-1">Live metrics and studio request logs</p>
        </div>
        <button onClick={load} className="p-2.5 border border-[#222] hover:border-gray-500 rounded-xl text-gray-400 hover:text-white transition-colors bg-[#141414]">
          <RefreshCw size={16} />
        </button>
      </div>

      {/* Grid Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-[#141414] p-6 rounded-2xl border border-[#222] flex items-center justify-between shadow-lg">
          <div>
            <div className="text-gray-400 text-xs mb-1 uppercase tracking-widest font-semibold">Total Frames</div>
            <div className="text-3xl text-white font-display font-medium">{totalFrames}</div>
          </div>
          <Film className="text-accent/60" size={28} />
        </div>

        <div className="bg-[#141414] p-6 rounded-2xl border border-[#222] flex items-center justify-between shadow-lg">
          <div>
            <div className="text-gray-400 text-xs mb-1 uppercase tracking-widest font-semibold">Featured styles</div>
            <div className="text-3xl text-white font-display font-medium">{featuredFrames}</div>
          </div>
          <Star className="text-accent/60 animate-pulse" size={28} />
        </div>

        <div className="bg-[#141414] p-6 rounded-2xl border border-[#222] flex items-center justify-between shadow-lg">
          <div>
            <div className="text-gray-400 text-xs mb-1 uppercase tracking-widest font-semibold">Inquiries</div>
            <div className="text-3xl text-white font-display font-medium">{totalInquiries}</div>
          </div>
          <MessageCircle className="text-accent/60" size={28} />
        </div>

        <div className="bg-[#141414] p-6 rounded-2xl border border-[#222] flex items-center justify-between shadow-lg">
          <div>
            <div className="text-gray-400 text-xs mb-1 uppercase tracking-widest font-semibold">Newsletter</div>
            <div className="text-3xl text-white font-display font-medium">{totalSubscribers}</div>
          </div>
          <Mail className="text-accent/60" size={28} />
        </div>
      </div>

      {/* Main Details row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Recent inquiries */}
        <div className="lg:col-span-8 bg-[#141414] border border-[#222] p-6 rounded-2xl shadow-lg space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-display text-white font-bold">Recent Customer Inquiries</h3>
            <Link to="/admin/inquiries" className="text-accent hover:underline text-[10px] uppercase font-bold tracking-widest">
              View All Inquiries &rarr;
            </Link>
          </div>

          <div className="space-y-4">
            {recentInquiries.map((inq) => (
              <div key={inq.id} className="flex items-center justify-between border-b border-[#222] pb-3 last:border-0 last:pb-0 text-xs">
                <div className="space-y-1">
                  <p className="font-bold text-white text-sm">{inq.customerName}</p>
                  <p className="text-gray-400">
                    Frame: <span className="text-accent font-semibold">{inq.frameName || 'Custom'}</span> &bull; Size: {inq.size}
                  </p>
                </div>
                <div className="text-right space-y-1">
                  <span className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] font-semibold uppercase tracking-wider ${
                    inq.status === 'pending' ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20' :
                    inq.status === 'confirmed' ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20' :
                    inq.status === 'in_progress' ? 'bg-orange-500/10 text-orange-500 border border-orange-500/20' :
                    inq.status === 'completed' ? 'bg-green-500/10 text-green-500 border border-green-500/20' :
                    'bg-red-500/10 text-red-500 border border-red-500/20'
                  }`}>
                    {inq.status.replace('_', ' ')}
                  </span>
                  <p className="text-[10px] text-gray-500 mt-1">
                    {new Date(inq.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                  </p>
                </div>
              </div>
            ))}
            {recentInquiries.length === 0 && (
              <p className="text-gray-500 text-xs italic py-6 text-center">No inquiry logs submitted yet.</p>
            )}
          </div>
        </div>

        {/* Popular designs */}
        <div className="lg:col-span-4 bg-[#141414] border border-[#222] p-6 rounded-2xl shadow-lg space-y-4">
          <h3 className="text-lg font-display text-white font-bold">Popular Frame Styles</h3>
          
          <div className="space-y-4">
            {popularFrames.map((frame) => (
              <div key={frame.id} className="flex items-center gap-3 border-b border-[#222] pb-3 last:border-0 last:pb-0 text-xs">
                <img 
                  src={frame.imageUrl} 
                  alt="" 
                  className="w-12 h-10 object-cover rounded-lg bg-[#222] border border-[#333]" 
                />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-white truncate text-sm">{frame.name}</p>
                  <p className="text-gray-500 truncate">{frame.category?.name || 'Frame'}</p>
                </div>
                <div className="flex items-center gap-1 text-gray-400 text-[10px]">
                  <Eye size={12} /> {frame.views || 0}
                </div>
              </div>
            ))}
            {popularFrames.length === 0 && (
              <p className="text-gray-500 text-xs italic py-6 text-center">No frame styles registered.</p>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};

export default AdminDashboard;
