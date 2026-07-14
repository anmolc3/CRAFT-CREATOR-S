import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash, Image as ImageIcon } from 'lucide-react';
import { serviceService } from '../../services/serviceService';

const AdminServicesPage = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const { data } = await serviceService.getAll();
      setServices(data || []);
    } catch (error) {
      console.error('Error fetching services', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this service?')) return;
    try {
      await serviceService.delete(id);
      setServices(services.filter(s => s.id !== id));
    } catch (error) {
      console.error('Error deleting service', error);
      alert('Failed to delete service');
    }
  };

  if (loading) return <div className="text-white p-8">Loading services...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-display text-white mb-1">Services Management</h2>
          <p className="text-gray-400 text-sm">Manage your photography services, pricing, and details.</p>
        </div>
        <button 
          onClick={() => alert('Add Service Modal would open here')}
          className="btn-gold flex items-center gap-2"
        >
          <Plus size={18} /> Add Service
        </button>
      </div>

      <div className="bg-[#1a1a1a] rounded-xl border border-[#2a2a2a] overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-[#222] text-xs uppercase tracking-wider text-gray-400 font-medium">
            <tr>
              <th className="px-6 py-4">Service</th>
              <th className="px-6 py-4">Price</th>
              <th className="px-6 py-4">Duration</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#2a2a2a]">
            {services.map((service) => (
              <tr key={service.id} className="hover:bg-[#222] transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded bg-[#333] flex items-center justify-center overflow-hidden shrink-0">
                      {service.heroImage ? (
                        <img src={service.heroImage} alt={service.title} className="w-full h-full object-cover" />
                      ) : (
                        <ImageIcon size={20} className="text-gray-500" />
                      )}
                    </div>
                    <div>
                      <div className="text-white font-medium">{service.title}</div>
                      <div className="text-gray-500 text-xs">{service.slug}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-300">
                  {service.price > 0 ? `₹${service.price.toLocaleString('en-IN')}` : 'Custom'}
                </td>
                <td className="px-6 py-4 text-gray-300">{service.duration || 'N/A'}</td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 text-xs rounded-full ${
                    service.status === 'active' ? 'bg-green-500/10 text-green-500' : 'bg-gray-500/10 text-gray-400'
                  }`}>
                    {service.status.toUpperCase()}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-gray-400 hover:text-white mx-2 transition-colors">
                    <Edit size={18} />
                  </button>
                  <button 
                    onClick={() => handleDelete(service.id)}
                    className="text-gray-400 hover:text-red-500 mx-2 transition-colors"
                  >
                    <Trash size={18} />
                  </button>
                </td>
              </tr>
            ))}
            {services.length === 0 && (
              <tr>
                <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                  No services found. Add one to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminServicesPage;
