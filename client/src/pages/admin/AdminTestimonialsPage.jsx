import React, { useEffect, useState } from 'react';
import { testimonialService } from '../../services/testimonialService';
import { StarRating } from '../../components/common/StarRating';
import { Plus, Edit2, Trash2, X, Star } from 'lucide-react';

const AdminTestimonialsPage = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState(null);

  // Form states
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [quote, setQuote] = useState('');
  const [rating, setRating] = useState(5);
  const [featured, setFeatured] = useState(false);
  const [saving, setSaving] = useState(false);

  const loadTestimonials = async () => {
    try {
      setLoading(true);
      const res = await testimonialService.getTestimonials();
      setTestimonials(res.data.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTestimonials();
  }, []);

  const openAddModal = () => {
    setEditingTestimonial(null);
    setName('');
    setTitle('');
    setQuote('');
    setRating(5);
    setFeatured(false);
    setShowModal(true);
  };

  const openEditModal = (test) => {
    setEditingTestimonial(test);
    setName(test.name || '');
    setTitle(test.title || '');
    setQuote(test.quote || '');
    setRating(test.rating || 5);
    setFeatured(!!test.featured);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this customer testimonial?')) {
      try {
        await testimonialService.deleteTestimonial(id);
        loadTestimonials();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    const payload = { name, title, quote, rating: parseInt(rating) || 5, featured };
    try {
      if (editingTestimonial) {
        await testimonialService.updateTestimonial(editingTestimonial.id, payload);
      } else {
        await testimonialService.createTestimonial(payload);
      }
      setShowModal(false);
      loadTestimonials();
    } catch (err) {
      console.error(err);
      alert('Error saving testimonial');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex justify-between items-center border-b border-[#222] pb-4">
        <div>
          <h2 className="text-xl font-display text-white font-bold">Client Reviews & Testimonials</h2>
          <p className="text-gray-400 text-xs mt-1">Review, add or configure which customer quotes appear on the homepage</p>
        </div>
        <button 
          onClick={openAddModal}
          className="bg-accent hover:bg-white text-primary px-5 py-2.5 rounded-full text-xs font-semibold tracking-widest uppercase transition-all flex items-center gap-1.5 shadow-luxury"
        >
          <Plus size={16} /> Add Testimonial
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
                <th className="p-4">Customer Name</th>
                <th className="p-4">Profession / Title</th>
                <th className="p-4">Quote Preview</th>
                <th className="p-4">Rating</th>
                <th className="p-4">Homepage Featured</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#222] text-gray-300">
              {testimonials.map((test) => (
                <tr key={test.id} className="hover:bg-[#1a1a1a] transition-colors">
                  <td className="p-4 font-bold text-white text-sm">{test.name}</td>
                  <td className="p-4 text-gray-400">{test.title || 'Client'}</td>
                  <td className="p-4 text-gray-400 max-w-sm truncate">"{test.quote}"</td>
                  <td className="p-4">
                    <StarRating rating={test.rating} size={12} />
                  </td>
                  <td className="p-4">
                    {test.featured ? (
                      <span className="px-2 py-0.5 rounded bg-yellow-500/10 text-yellow-500 text-[8px] font-bold uppercase border border-yellow-500/20">Featured</span>
                    ) : (
                      <span className="text-gray-600 font-light">&mdash;</span>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => openEditModal(test)}
                        className="p-2 border border-[#333] hover:border-gray-500 hover:text-white rounded-lg transition-colors"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button 
                        onClick={() => handleDelete(test.id)}
                        className="p-2 border border-[#333] hover:border-red-500 hover:text-red-400 rounded-lg transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {testimonials.length === 0 && (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-gray-500 italic">No testimonials registered.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#141414] rounded-3xl border border-[#222] w-full max-w-md p-8 space-y-6 shadow-luxury text-xs text-gray-300 animate-fade-in">
            <div className="flex justify-between items-center border-b border-[#222] pb-3">
              <h3 className="font-display text-lg font-bold text-white">
                {editingTestimonial ? 'Edit Testimonial' : 'Add Testimonial'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] uppercase text-gray-500 tracking-widest font-semibold block">Customer Name</label>
                <input 
                  type="text" 
                  required 
                  value={name} 
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Priya Sharma"
                  className="w-full bg-[#1e1e1e] border border-[#333] rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-accent"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase text-gray-500 tracking-widest font-semibold block">Client Subtitle (Designation)</label>
                <input 
                  type="text" 
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Art Collector, Mumbai"
                  className="w-full bg-[#1e1e1e] border border-[#333] rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-accent"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase text-gray-500 tracking-widest font-semibold block">Review Quote</label>
                <textarea 
                  rows="3"
                  required
                  value={quote} 
                  onChange={(e) => setQuote(e.target.value)}
                  placeholder="Insert client review text..."
                  className="w-full bg-[#1e1e1e] border border-[#333] rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-accent resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase text-gray-500 tracking-widest font-semibold block">Rating (Stars)</label>
                  <select 
                    value={rating} 
                    onChange={(e) => setRating(parseInt(e.target.value))}
                    className="w-full bg-[#1e1e1e] border border-[#333] rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-accent"
                  >
                    <option value="5">5 Stars</option>
                    <option value="4">4 Stars</option>
                    <option value="3">3 Stars</option>
                    <option value="2">2 Stars</option>
                    <option value="1">1 Star</option>
                  </select>
                </div>

                <div className="flex items-center gap-2 pt-6">
                  <input 
                    type="checkbox" 
                    id="featuredTestimonial" 
                    checked={featured} 
                    onChange={(e) => setFeatured(e.target.checked)}
                    className="h-4 w-4 rounded bg-[#1e1e1e] border-[#333] text-accent accent-accent focus:ring-0"
                  />
                  <label htmlFor="featuredTestimonial" className="font-semibold text-gray-400">Featured style</label>
                </div>
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
                  {saving ? 'Saving...' : 'Save Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminTestimonialsPage;
