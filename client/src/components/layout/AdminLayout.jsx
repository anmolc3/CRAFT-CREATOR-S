import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { 
  Briefcase, 
  Settings, 
  LogOut, 
  Sliders, 
  MessageSquare, 
  Layers, 
  Film, 
  Mail, 
  FileText, 
  LayoutDashboard 
} from 'lucide-react';

const AdminLayout = () => {
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    window.location.href = '/admin/login';
  };

  const navLinks = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Frame Catalog', path: '/admin/frames', icon: Film },
    { name: 'Categories', path: '/admin/categories', icon: Layers },
    { name: 'Inquiries', path: '/admin/inquiries', icon: MessageSquare },
    { name: 'Services', path: '/admin/services', icon: Briefcase },
    { name: 'Testimonials', path: '/admin/testimonials', icon: FileText },
    { name: 'Newsletter', path: '/admin/newsletter', icon: Mail },
    { name: 'Configurator Config', path: '/admin/config', icon: Sliders },
    { name: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#0e0e0e] text-gray-300 font-body flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#141414] border-r border-[#222222] flex flex-col fixed inset-y-0 z-20">
        <div className="p-6 border-b border-[#222222]">
          <Link to="/" className="text-lg font-display text-white font-bold tracking-widest flex flex-col">
            <span>CRAFT CREATOR'S</span>
            <span className="text-[9px] text-accent tracking-[0.2em] font-body uppercase mt-1">Framing Admin</span>
          </Link>
        </div>

        <nav className="flex-1 py-6 space-y-1 overflow-y-auto px-3">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;
            return (
              <Link 
                key={link.name} 
                to={link.path} 
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium tracking-wide transition-all duration-300 ${
                  isActive 
                    ? 'bg-accent text-primary font-bold shadow-luxury' 
                    : 'text-gray-400 hover:bg-[#1f1f1f] hover:text-white'
                }`}
              >
                <Icon size={18} />
                {link.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-[#222222]">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 text-sm font-body font-medium text-gray-400 hover:text-red-400 hover:bg-[#1a1313] transition-all duration-300 w-full rounded-lg"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 min-h-screen bg-[#0a0a0a]">
        <div className="p-8 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
