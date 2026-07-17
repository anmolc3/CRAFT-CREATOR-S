import React, { useEffect, useState } from 'react';
import { categoryService } from '../../services/categoryService';
import { Plus, Edit2, Trash2, X } from 'lucide-react';

const AdminCategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  // Form states
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [order, setOrder] = useState('0');
  const [saving, setSaving] = useState(false);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const res = await categoryService.getCategories();
      setCategories(res.data.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const openAddModal = () => {
    setEditingCategory(null);
    setName('');
    setDescription('');
    setOrder('0');
    setShowModal(true);
  };

  const openEditModal = (cat) => {
    setEditingCategory(cat);
    setName(cat.name || '');
    setDescription(cat.description || '');
    setOrder(String(cat.order || 0));
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this category? Frame styles belonging here will lose category references.')) {
      try {
        await categoryService.deleteCategory(id);
        loadCategories();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { name, description, order: parseInt(order) || 0 };
      if (editingCategory) {
        await categoryService.updateCategory(editingCategory.id, payload);
      } else {
        await categoryService.createCategory(payload);
      }
      setShowModal(false);
      loadCategories();
    } catch (err) {
      console.error(err);
      alert('Error saving category');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex justify-between items-center border-b border-[#222] pb-4">
        <div>
          <h2 className="text-xl font-display text-white font-bold">Category Configuration</h2>
          <p className="text-gray-400 text-xs mt-1">Manage catalog collections (Teak wood, floating, minimal, metal frames etc.)</p>
        </div>
        <button 
          onClick={openAddModal}
          className="bg-accent hover:bg-white text-primary px-5 py-2.5 rounded-full text-xs font-semibold tracking-widest uppercase transition-all flex items-center gap-1.5 shadow-luxury"
        >
          <Plus size={16} /> Add Category
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
                <th className="p-4">Category Name</th>
                <th className="p-4">Description</th>
                <th className="p-4">Order index</th>
                <th className="p-4">Linked Frames</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#222] text-gray-300">
              {categories.map((cat) => (
                <tr key={cat.id} className="hover:bg-[#1a1a1a] transition-colors">
                  <td className="p-4 font-bold text-white text-sm">{cat.name}</td>
                  <td className="p-4 text-gray-400 max-w-sm truncate">{cat.description || 'No description provided'}</td>
                  <td className="p-4">{cat.order}</td>
                  <td className="p-4 font-semibold text-accent">
                    {cat._count?.frames || 0} styles
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => openEditModal(cat)}
                        className="p-2 border border-[#333] hover:border-gray-500 hover:text-white rounded-lg transition-colors"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button 
                        onClick={() => handleDelete(cat.id)}
                        className="p-2 border border-[#333] hover:border-red-500 hover:text-red-400 rounded-lg transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {categories.length === 0 && (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-gray-500 italic">No categories created.</td>
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
                {editingCategory ? 'Edit Category' : 'Add Category'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] uppercase text-gray-500 tracking-widest font-semibold block">Category Name</label>
                <input 
                  type="text" 
                  required 
                  value={name} 
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Vintage Frames"
                  className="w-full bg-[#1e1e1e] border border-[#333] rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-accent"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase text-gray-500 tracking-widest font-semibold block">Description</label>
                <textarea 
                  rows="3"
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. Ornate hand carved moldings in gilded leaf..."
                  className="w-full bg-[#1e1e1e] border border-[#333] rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-accent resize-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase text-gray-500 tracking-widest font-semibold block">Ordering Order</label>
                <input 
                  type="number" 
                  value={order} 
                  onChange={(e) => setOrder(e.target.value)}
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
                  {saving ? 'Saving...' : 'Save Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminCategoriesPage;
