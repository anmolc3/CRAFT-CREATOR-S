import React, { useEffect, useState } from 'react';
import { frameService } from '../../services/frameService';
import { categoryService } from '../../services/categoryService';
import { Plus, Edit2, Trash2, X, Upload } from 'lucide-react';

const AdminFramesPage = () => {
  const [frames, setFrames] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingFrame, setEditingFrame] = useState(null);

  // Form states
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [material, setMaterial] = useState('Solid Wood');
  const [colors, setColors] = useState('Natural Oak');
  const [availableSizes, setAvailableSizes] = useState('8×10, 12×18, 16×24');
  const [thickness, setThickness] = useState('2cm');
  const [basePrice, setBasePrice] = useState('2500');
  const [productionDays, setProductionDays] = useState('3');
  const [featured, setFeatured] = useState(false);
  const [bestseller, setBestseller] = useState(false);
  const [categoryId, setCategoryId] = useState('');
  const [saving, setSaving] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const [framesRes, catRes] = await Promise.all([
        frameService.getFrames({ limit: 100 }),
        categoryService.getCategories(),
      ]);
      setFrames(framesRes.data.data || []);
      setCategories(catRes.data.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openAddModal = () => {
    setEditingFrame(null);
    setName('');
    setDescription('');
    setImageUrl('https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=800&q=85');
    setMaterial('Solid Wood');
    setColors('Natural Oak');
    setAvailableSizes('8×10, 12×18, 16×24');
    setThickness('2cm');
    setBasePrice('2500');
    setProductionDays('3');
    setFeatured(false);
    setBestseller(false);
    setCategoryId(categories[0]?.id || '');
    setShowModal(true);
  };

  const openEditModal = (frame) => {
    setEditingFrame(frame);
    setName(frame.name || '');
    setDescription(frame.description || '');
    setImageUrl(frame.imageUrl || '');
    setMaterial(frame.material || 'Solid Wood');
    setColors(frame.colors?.join(', ') || '');
    setAvailableSizes(frame.availableSizes?.join(', ') || '');
    setThickness(frame.thickness || '2cm');
    setBasePrice(String(frame.basePrice || 2500));
    setProductionDays(String(frame.productionDays || 3));
    setFeatured(!!frame.featured);
    setBestseller(!!frame.bestseller);
    setCategoryId(frame.categoryId || '');
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this frame style?')) {
      try {
        await frameService.deleteFrame(id);
        loadData();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    // Parse comma strings to arrays
    const colorsArr = colors.split(',').map(s => s.trim()).filter(Boolean);
    const sizesArr = availableSizes.split(',').map(s => s.trim()).filter(Boolean);

    const payload = {
      name,
      description,
      imageUrl,
      material,
      colors: colorsArr,
      availableSizes: sizesArr,
      thickness,
      basePrice: parseInt(basePrice) || 2000,
      productionDays: parseInt(productionDays) || 3,
      featured,
      bestseller,
      categoryId,
      isAvailable: true,
    };

    try {
      if (editingFrame) {
        await frameService.updateFrame(editingFrame.id, payload);
      } else {
        await frameService.createFrame(payload);
      }
      setShowModal(false);
      loadData();
    } catch (err) {
      console.error(err);
      alert('Error saving frame style.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex justify-between items-center border-b border-[#222] pb-4">
        <div>
          <h2 className="text-xl font-display text-white font-bold">Frame Catalog Management</h2>
          <p className="text-gray-400 text-xs mt-1">Add, update, or remove frame designs from the catalog</p>
        </div>
        <button 
          onClick={openAddModal}
          className="bg-accent hover:bg-white text-primary px-5 py-2.5 rounded-full text-xs font-semibold tracking-widest uppercase transition-all flex items-center gap-1.5 shadow-luxury"
        >
          <Plus size={16} /> Add Style
        </button>
      </div>

      {/* Frame Table */}
      {loading ? (
        <div className="text-center py-20">
          <div className="w-10 h-10 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      ) : (
        <div className="bg-[#141414] rounded-2xl border border-[#222] overflow-hidden shadow-lg">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#1c1c1c] text-gray-400 uppercase tracking-wider font-semibold border-b border-[#222] text-[10px]">
              <tr>
                <th className="p-4">Preview</th>
                <th className="p-4">Name</th>
                <th className="p-4">Category</th>
                <th className="p-4">Material</th>
                <th className="p-4">Base Price</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#222] text-gray-300">
              {frames.map((frame) => (
                <tr key={frame.id} className="hover:bg-[#1a1a1a] transition-colors">
                  <td className="p-4">
                    <img src={frame.imageUrl} alt="" className="h-10 w-12 object-cover rounded bg-[#222] border border-[#333]" />
                  </td>
                  <td className="p-4 font-bold text-white text-sm">{frame.name}</td>
                  <td className="p-4 text-gray-400">{frame.category?.name || 'TBD'}</td>
                  <td className="p-4">{frame.material}</td>
                  <td className="p-4 font-bold text-accent">₹{frame.basePrice}</td>
                  <td className="p-4">
                    <div className="flex gap-1.5">
                      {frame.featured && <span className="px-2 py-0.5 rounded bg-yellow-500/10 text-yellow-500 text-[8px] font-bold uppercase tracking-wider border border-yellow-500/20">Featured</span>}
                      {frame.bestseller && <span className="px-2 py-0.5 rounded bg-orange-500/10 text-orange-500 text-[8px] font-bold uppercase tracking-wider border border-orange-500/20">Bestseller</span>}
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => openEditModal(frame)}
                        className="p-2 border border-[#333] hover:border-gray-500 hover:text-white rounded-lg transition-colors"
                        title="Edit Style"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button 
                        onClick={() => handleDelete(frame.id)}
                        className="p-2 border border-[#333] hover:border-red-500 hover:text-red-400 rounded-lg transition-colors"
                        title="Delete Style"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {frames.length === 0 && (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-gray-500 italic">No frame styles registered.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Add / Edit Frame Design Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#141414] rounded-3xl border border-[#222] w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-luxury p-8 space-y-6 animate-fade-in text-xs text-gray-300">
            <div className="flex justify-between items-center border-b border-[#222] pb-3">
              <h3 className="font-display text-lg font-bold text-white">
                {editingFrame ? 'Edit Frame Style' : 'Add Frame Style'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase text-gray-500 tracking-widest font-semibold block">Style Name</label>
                  <input 
                    type="text" 
                    required 
                    value={name} 
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Teak Classic"
                    className="w-full bg-[#1e1e1e] border border-[#333] rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-accent"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase text-gray-500 tracking-widest font-semibold block">Category</label>
                  <select 
                    value={categoryId} 
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full bg-[#1e1e1e] border border-[#333] rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-accent"
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase text-gray-500 tracking-widest font-semibold block">Description</label>
                <textarea 
                  rows="3"
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter details about finish, wood grain, design theme..."
                  className="w-full bg-[#1e1e1e] border border-[#333] rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-accent resize-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase text-gray-500 tracking-widest font-semibold block">Product Image URL</label>
                <input 
                  type="text" 
                  required 
                  value={imageUrl} 
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="Paste Unsplash image URL or hosting link"
                  className="w-full bg-[#1e1e1e] border border-[#333] rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-accent"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase text-gray-500 tracking-widest font-semibold block">Material</label>
                  <select 
                    value={material} 
                    onChange={(e) => setMaterial(e.target.value)}
                    className="w-full bg-[#1e1e1e] border border-[#333] rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-accent"
                  >
                    <option value="Solid Wood">Solid Wood</option>
                    <option value="MDF Wood">MDF Wood</option>
                    <option value="Aluminium">Aluminium</option>
                    <option value="Steel">Steel</option>
                    <option value="Composite">Composite</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase text-gray-500 tracking-widest font-semibold block">Thickness (Width)</label>
                  <input 
                    type="text" 
                    required 
                    value={thickness} 
                    onChange={(e) => setThickness(e.target.value)}
                    placeholder="e.g. 2cm"
                    className="w-full bg-[#1e1e1e] border border-[#333] rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-accent"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase text-gray-500 tracking-widest font-semibold block">Base Price (₹)</label>
                  <input 
                    type="number" 
                    required 
                    value={basePrice} 
                    onChange={(e) => setBasePrice(e.target.value)}
                    placeholder="Starting price"
                    className="w-full bg-[#1e1e1e] border border-[#333] rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-accent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase text-gray-500 tracking-widest font-semibold block">Colors (Comma separated)</label>
                  <input 
                    type="text" 
                    required 
                    value={colors} 
                    onChange={(e) => setColors(e.target.value)}
                    placeholder="Natural Oak, Matte Black, Gloss White"
                    className="w-full bg-[#1e1e1e] border border-[#333] rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-accent"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase text-gray-500 tracking-widest font-semibold block">Sizes (Comma separated)</label>
                  <input 
                    type="text" 
                    required 
                    value={availableSizes} 
                    onChange={(e) => setAvailableSizes(e.target.value)}
                    placeholder="8×10, 12×18, 16×24, 24×36"
                    className="w-full bg-[#1e1e1e] border border-[#333] rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-accent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase text-gray-500 tracking-widest font-semibold block">Production Days</label>
                  <input 
                    type="number" 
                    required 
                    value={productionDays} 
                    onChange={(e) => setProductionDays(e.target.value)}
                    className="w-full bg-[#1e1e1e] border border-[#333] rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-accent"
                  />
                </div>

                <div className="flex items-center gap-2 pt-6">
                  <input 
                    type="checkbox" 
                    id="featured" 
                    checked={featured} 
                    onChange={(e) => setFeatured(e.target.checked)}
                    className="h-4 w-4 rounded bg-[#1e1e1e] border-[#333] text-accent accent-accent focus:ring-0"
                  />
                  <label htmlFor="featured" className="font-semibold text-gray-400">Featured style</label>
                </div>

                <div className="flex items-center gap-2 pt-6">
                  <input 
                    type="checkbox" 
                    id="bestseller" 
                    checked={bestseller} 
                    onChange={(e) => setBestseller(e.target.checked)}
                    className="h-4 w-4 rounded bg-[#1e1e1e] border-[#333] text-accent accent-accent focus:ring-0"
                  />
                  <label htmlFor="bestseller" className="font-semibold text-gray-400">Bestseller style</label>
                </div>
              </div>

              <div className="flex gap-3 pt-4 justify-end border-t border-[#222]">
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)}
                  className="px-6 py-2.5 border border-[#333] hover:border-gray-500 rounded-full font-semibold uppercase tracking-wider text-[10px] text-gray-400 hover:text-white"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={saving}
                  className="bg-accent hover:bg-white text-primary px-6 py-2.5 rounded-full font-semibold uppercase tracking-wider text-[10px] transition-all shadow-luxury"
                >
                  {saving ? 'Saving...' : 'Save Style'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminFramesPage;
