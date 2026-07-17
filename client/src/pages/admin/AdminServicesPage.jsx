import React, { useEffect, useState } from 'react';
import { serviceService } from '../../services/serviceService';
import { Plus, Edit2, Trash2, X } from 'lucide-react';

const AdminServicesPage = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState(null);

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startingPrice, setStartingPrice] = useState('1500');
  const [duration, setDuration] = useState('2-4 working days');
  const [includes, setIncludes] = useState('');
  const [saving, setSaving] = useState(false);

  const loadServices = async () => {
    try {
      setLoading(true);
      const res = await serviceService.getServices();
      setServices(res.data.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadServices();
  }, []);

  const openAddModal = () => {
    setEditingService(null);
    setTitle('');
    setDescription('');
    setStartingPrice('1500');
    setDuration('2-4 working days');
    setIncludes('Free size consultation, Acid-free mat, Professional hanging wire');
    setShowModal(true);
  };

  const openEditModal = (srv) => {
    setEditingService(srv);
    setTitle(srv.title || '');
    setDescription(srv.description || '');
    setStartingPrice(String(srv.startingPrice || 1500));
    setDuration(srv.duration || '2-4 working days');
    setIncludes(Array.isArray(srv.includes) ? srv.includes.join(', ') : '');
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      try {
        await serviceService.deleteService(id);
        loadServices();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);

    const includesArr = includes.split(',').map(s => s.trim()).filter(Boolean);
    const payload = {
      title,
      description,
      startingPrice: parseInt(startingPrice) || 1500,
      duration,
      includes: includesArr,
      status: 'active'
    };

    try {
      if (editingService) {
        await serviceService.updateService(editingService.id, payload);
      } else {
        await serviceService.createService(payload);
      }
      setShowModal(false);
      loadServices();
    } catch (err) {
      console.error(err);
      alert('Error saving service.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex justify-between items-center border-b border-[#222] pb-4">
        <div>
          <h2 className="text-xl font-display text-white font-bold">Services Administration</h2>
          <p className="text-gray-400 text-xs mt-1">Configure service cards (Canvas stretching, certificate framing, glass replacement...)</p>
        </div>
        <button 
          onClick={openAddModal}
          className="bg-accent hover:bg-white text-primary px-5 py-2.5 rounded-full text-xs font-semibold tracking-widest uppercase transition-all flex items-center gap-1.5 shadow-luxury"
        >
          <Plus size={16} /> Add Service
        </button>
      </div>

      {/* Table */}
      {loading ? (
        <div className="text-center py-20">
          <div className="w-10 h-10 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      ) : (
        <div className="bg-[#141414] rounded-2xl border border-[#222] overflow-hidden shadow-lg">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#1c1c1c] text-gray-400 uppercase tracking-wider font-semibold border-b border-[#222] text-[10px]">
              <tr>
                <th className="p-4">Service Title</th>
                <th className="p-4">Short Description</th>
                <th className="p-4">Starting Price</th>
                <th className="p-4">Completion Speed</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#222] text-gray-300">
              {services.map((srv) => (
                <tr key={srv.id} className="hover:bg-[#1a1a1a] transition-colors">
                  <td className="p-4 font-bold text-white text-sm">{srv.title}</td>
                  <td className="p-4 text-gray-400 max-w-sm truncate">{srv.description}</td>
                  <td className="p-4 font-bold text-accent">₹{srv.startingPrice}</td>
                  <td className="p-4 text-gray-400">{srv.duration}</td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => openEditModal(srv)}
                        className="p-2 border border-[#333] hover:border-gray-500 hover:text-white rounded-lg transition-colors"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button 
                        onClick={() => handleDelete(srv.id)}
                        className="p-2 border border-[#333] hover:border-red-500 hover:text-red-400 rounded-lg transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {services.length === 0 && (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-gray-500 italic">No services found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Add / Edit Service Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#141414] rounded-3xl border border-[#222] w-full max-w-lg p-8 space-y-6 shadow-luxury text-xs text-gray-300 animate-fade-in">
            <div className="flex justify-between items-center border-b border-[#222] pb-3">
              <h3 className="font-display text-lg font-bold text-white">
                {editingService ? 'Edit Framing Service' : 'Add Framing Service'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] uppercase text-gray-500 tracking-widest font-semibold block">Service Title</label>
                <input 
                  type="text" 
                  required 
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Canvas Stretcher Framing"
                  className="w-full bg-[#1e1e1e] border border-[#333] rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-accent"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase text-gray-500 tracking-widest font-semibold block">Description</label>
                <textarea 
                  rows="3"
                  required
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Description of target canvas sizes, finishes, wraps..."
                  className="w-full bg-[#1e1e1e] border border-[#333] rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-accent resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase text-gray-500 tracking-widest font-semibold block">Starting Price (₹)</label>
                  <input 
                    type="number" 
                    required 
                    value={startingPrice} 
                    onChange={(e) => setStartingPrice(e.target.value)}
                    className="w-full bg-[#1e1e1e] border border-[#333] rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-accent"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase text-gray-500 tracking-widest font-semibold block">Estimated Speed</label>
                  <input 
                    type="text" 
                    required 
                    value={duration} 
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="e.g. 2-4 working days"
                    className="w-full bg-[#1e1e1e] border border-[#333] rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-accent"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase text-gray-500 tracking-widest font-semibold block">Includes (Comma separated)</label>
                <input 
                  type="text" 
                  value={includes} 
                  onChange={(e) => setIncludes(e.target.value)}
                  placeholder="Acid-free mounting, wire hanger, dust backing"
                  className="w-full bg-[#1e1e1e] border border-[#333] rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-accent"
                />
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t border-[#222]">
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)}
                  className="px-6 py-2.5 border border-[#333] rounded-full font-semibold uppercase tracking-wider text-[10px] text-gray-400 hover:text-white"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={saving}
                  className="bg-accent hover:bg-white text-primary px-6 py-2.5 rounded-full font-semibold uppercase tracking-wider text-[10px] transition-all shadow-luxury"
                >
                  {saving ? 'Saving...' : 'Save Service'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminServicesPage;
