import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Camera, Image as ImageIcon, Briefcase, Calendar, Users, Settings, LogOut, Folder, Sliders } from 'lucide-react';

const AdminLayout = () => {
  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    window.location.href = '/admin/login';
  };

  return (
    <div className="min-h-screen bg-[#111] text-gray-300 font-body flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#1a1a1a] border-r border-[#2a2a2a] flex flex-col fixed inset-y-0 z-20">
        <div className="p-6 border-b border-[#2a2a2a]">
          <Link to="/admin" className="text-lg font-display text-white flex items-center gap-3">
            <img src="/cc-logo.svg" alt="Craft Creator's Logo" className="h-8 w-8 object-contain rounded-full shadow-sm" />
            <span>Admin Panel</span>
          </Link>
        </div>

        <nav className="flex-1 py-6 space-y-1 overflow-y-auto">
          <Link to="/admin" className="admin-nav-link text-white">
            <Settings size={18} /> Dashboard
          </Link>
          <div className="px-4 py-3 mt-4 text-xs font-medium uppercase tracking-widest text-gray-500">
            Portfolio & Prints
          </div>
          <Link to="/admin/photos" className="admin-nav-link">
            <ImageIcon size={18} /> Photos
          </Link>
          <Link to="/admin/collections" className="admin-nav-link">
            <Folder size={18} /> Collections
          </Link>
          <Link to="/admin/config" className="admin-nav-link">
            <Sliders size={18} /> Configurator
          </Link>
          <div className="px-4 py-3 mt-4 text-xs font-medium uppercase tracking-widest text-gray-500">
            Services & Bookings
          </div>
          <Link to="/admin/services" className="admin-nav-link">
            <Briefcase size={18} /> Services
          </Link>
          <Link to="/admin/bookings" className="admin-nav-link">
            <Calendar size={18} /> Bookings
          </Link>
          <Link to="/admin/client-galleries" className="admin-nav-link">
            <Users size={18} /> Client Galleries
          </Link>
        </nav>

        <div className="p-4 border-t border-[#2a2a2a]">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 text-sm font-body font-medium text-gray-400 hover:text-red-400 transition-colors w-full rounded-lg"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
