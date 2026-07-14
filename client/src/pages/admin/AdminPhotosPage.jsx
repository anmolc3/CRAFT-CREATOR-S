import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2, Eye, EyeOff, Star, Award, Flame, X, Upload, Check } from 'lucide-react';
import { photoService } from '../../services/photoService';
import { categoryService } from '../../services/categoryService';

const INIT_FORM = {
  title: '', description: '', story: '', camera: '', lens: '', iso: '',
  aperture: '', shutterSpeed: '', location: '', resolution: '', orientation: 'landscape',
  tags: '', status: 'published', basePrice: 4500, categoryId: '',
  featured: false, bestSeller: false, limitedEdition: false,
  editionSize: 100, editionSold: 0, imageUrl: '',
};

const AdminPhotosPage = () => {
  const [photos, setPhotos] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(INIT_FORM);
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const load = async () => {
    setLoading(true);
    try {
      const [pr, cr] = await Promise.all([
        photoService.getAll({ limit: 200, status: filterStatus === 'all' ? undefined : filterStatus }),
        categoryService.getAll(),
      ]);
      setPhotos(pr.data || []);
      setCategories(cr.data || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [filterStatus]);

  const openCreate = () => { setEditId(null); setForm(INIT_FORM); setImageFile(null); setPreview(null); setShowForm(true); };
  const openEdit = (p) => {
    setEditId(p.id);
    setForm({
      title: p.title || '', description: p.description || '', story: p.story || '',
      camera: p.camera || '', lens: p.lens || '', iso: p.iso || '',
      aperture: p.aperture || '', shutterSpeed: p.shutterSpeed || '',
      location: p.location || '', resolution: p.resolution || '',
      orientation: p.orientation || 'landscape', tags: (p.tags || []).join(', '),
      status: p.status || 'published', basePrice: p.basePrice || 4500,
      categoryId: p.categoryId || '', featured: p.featured || false,
      bestSeller: p.bestSeller || false, limitedEdition: p.limitedEdition || false,
      editionSize: p.editionSize || 100, editionSold: p.editionSold || 0, imageUrl: p.imageUrl || '',
    });
    setPreview(p.imageUrl || null);
    setImageFile(null);
    setShowForm(true);
  };

  const handleFile = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setImageFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (imageFile) fd.append('image', imageFile);
      if (editId) {
        await photoService.update(editId, fd);
      } else {
        await photoService.create(fd);
      }
      setShowForm(false);
      load();
    } catch (e) { console.error(e); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this photo permanently?')) return;
    try { await photoService.delete(id); load(); } catch (e) { console.error(e); }
  };

  const toggleFlag = async (photo, flag) => {
    const fd = new FormData();
    fd.append(flag, !photo[flag]);
    try { await photoService.update(photo.id, fd); load(); } catch (e) { console.error(e); }
  };

  const toggleStatus = async (photo) => {
    const fd = new FormData();
    fd.append('status', photo.status === 'published' ? 'draft' : 'published');
    try { await photoService.update(photo.id, fd); load(); } catch (e) { console.error(e); }
  };

  const filtered = photos.filter(p => p.title?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-display text-white">Photos</h1>
          <p className="text-gray-400 text-sm mt-1">{photos.length} total photographs</p>
        </div>
        <button onClick={openCreate} className="btn-gold flex items-center gap-2">
          <Plus size={18} /> Add Photo
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-6 flex-wrap">
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search photos..."
          className="form-input bg-[#1a1a1a] border-[#333] text-white placeholder-gray-500 flex-1 min-w-[200px]"
        />
        {['all', 'published', 'draft'].map(s => (
          <button
            key={s}
            onClick={() => setFilterStatus(s)}
            className={`px-4 py-2 text-sm font-body border transition-all ${
              filterStatus === s ? 'border-accent text-accent' : 'border-[#333] text-gray-400 hover:border-gray-500'
            }`}
          >
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      {/* Table */}
      {loading ? (
        <div className="space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="skeleton h-16 rounded" />)}</div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-[#2a2a2a]">
          <table className="w-full text-sm font-body">
            <thead className="bg-[#1a1a1a] text-gray-400 text-xs uppercase tracking-widest">
              <tr>
                <th className="text-left px-4 py-3">Photo</th>
                <th className="text-left px-4 py-3">Title</th>
                <th className="text-left px-4 py-3">Price</th>
                <th className="text-center px-4 py-3">Status</th>
                <th className="text-center px-4 py-3">Flags</th>
                <th className="text-right px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#222]">
              {filtered.map(photo => (
                <tr key={photo.id} className="hover:bg-[#1f1f1f] transition-colors">
                  <td className="px-4 py-3">
                    <div className="w-14 h-10 overflow-hidden rounded bg-[#2a2a2a]">
                      {photo.imageUrl && (
                        <img src={photo.imageUrl} alt="" className="w-full h-full object-cover" />
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-white font-medium">{photo.title}</p>
                    {photo.category && <p className="text-gray-500 text-xs">{photo.category.name}</p>}
                  </td>
                  <td className="px-4 py-3 text-gray-300">₹{photo.basePrice?.toLocaleString('en-IN')}</td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => toggleStatus(photo)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-full border transition-colors ${
                        photo.status === 'published'
                          ? 'border-green-700 text-green-400 bg-green-900/20'
                          : 'border-gray-600 text-gray-400'
                      }`}
                    >
                      {photo.status === 'published' ? <Eye size={11} /> : <EyeOff size={11} />}
                      {photo.status}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-2">
                      <button onClick={() => toggleFlag(photo, 'featured')} title="Featured" className={`p-1 rounded transition-colors ${photo.featured ? 'text-accent' : 'text-gray-600 hover:text-gray-400'}`}>
                        <Star size={14} fill={photo.featured ? 'currentColor' : 'none'} />
                      </button>
                      <button onClick={() => toggleFlag(photo, 'bestSeller')} title="Best Seller" className={`p-1 rounded transition-colors ${photo.bestSeller ? 'text-orange-400' : 'text-gray-600 hover:text-gray-400'}`}>
                        <Flame size={14} />
                      </button>
                      <button onClick={() => toggleFlag(photo, 'limitedEdition')} title="Limited Edition" className={`p-1 rounded transition-colors ${photo.limitedEdition ? 'text-purple-400' : 'text-gray-600 hover:text-gray-400'}`}>
                        <Award size={14} />
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => openEdit(photo)} className="p-2 text-gray-400 hover:text-white transition-colors">
                        <Edit2 size={15} />
                      </button>
                      <button onClick={() => handleDelete(photo.id)} className="p-2 text-gray-600 hover:text-red-400 transition-colors">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-16 text-gray-500">No photos found.</div>
          )}
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-start justify-center overflow-y-auto py-8 px-4">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#1a1a1a] border border-[#2a2a2a] w-full max-w-3xl rounded-lg"
          >
            <div className="flex items-center justify-between p-6 border-b border-[#2a2a2a]">
              <h2 className="text-xl font-display text-white">{editId ? 'Edit Photo' : 'Add Photo'}</h2>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-white"><X size={22} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {/* Image upload */}
              <div>
                <label className="form-label text-gray-400">Image</label>
                <div className="flex items-start gap-4">
                  {preview && (
                    <img src={preview} alt="" className="w-24 h-20 object-cover rounded border border-[#333]" />
                  )}
                  <label className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-[#333] p-6 cursor-pointer hover:border-accent transition-colors rounded">
                    <Upload size={20} className="text-gray-500 mb-2" />
                    <span className="text-sm text-gray-400">Click to upload image</span>
                    <input type="file" accept="image/*" onChange={handleFile} className="hidden" />
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="form-label text-gray-400">Title *</label>
                  <input required value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                    className="form-input bg-[#111] border-[#333] text-white" />
                </div>
                <div>
                  <label className="form-label text-gray-400">Category</label>
                  <select value={form.categoryId} onChange={e => setForm(f => ({ ...f, categoryId: e.target.value }))}
                    className="form-input bg-[#111] border-[#333] text-white">
                    <option value="">— None —</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="form-label text-gray-400">Base Price (₹)</label>
                  <input type="number" value={form.basePrice} onChange={e => setForm(f => ({ ...f, basePrice: e.target.value }))}
                    className="form-input bg-[#111] border-[#333] text-white" />
                </div>
                <div>
                  <label className="form-label text-gray-400">Status</label>
                  <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
                    className="form-input bg-[#111] border-[#333] text-white">
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
                <div>
                  <label className="form-label text-gray-400">Orientation</label>
                  <select value={form.orientation} onChange={e => setForm(f => ({ ...f, orientation: e.target.value }))}
                    className="form-input bg-[#111] border-[#333] text-white">
                    <option value="landscape">Landscape</option>
                    <option value="portrait">Portrait</option>
                    <option value="square">Square</option>
                  </select>
                </div>
                <div>
                  <label className="form-label text-gray-400">Location</label>
                  <input value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
                    className="form-input bg-[#111] border-[#333] text-white" />
                </div>
                <div>
                  <label className="form-label text-gray-400">Camera</label>
                  <input value={form.camera} onChange={e => setForm(f => ({ ...f, camera: e.target.value }))}
                    className="form-input bg-[#111] border-[#333] text-white" />
                </div>
                <div>
                  <label className="form-label text-gray-400">Lens</label>
                  <input value={form.lens} onChange={e => setForm(f => ({ ...f, lens: e.target.value }))}
                    className="form-input bg-[#111] border-[#333] text-white" />
                </div>
                <div>
                  <label className="form-label text-gray-400">ISO</label>
                  <input value={form.iso} onChange={e => setForm(f => ({ ...f, iso: e.target.value }))}
                    className="form-input bg-[#111] border-[#333] text-white" />
                </div>
                <div>
                  <label className="form-label text-gray-400">Aperture</label>
                  <input value={form.aperture} onChange={e => setForm(f => ({ ...f, aperture: e.target.value }))}
                    className="form-input bg-[#111] border-[#333] text-white" />
                </div>
                <div>
                  <label className="form-label text-gray-400">Shutter Speed</label>
                  <input value={form.shutterSpeed} onChange={e => setForm(f => ({ ...f, shutterSpeed: e.target.value }))}
                    className="form-input bg-[#111] border-[#333] text-white" />
                </div>
                <div>
                  <label className="form-label text-gray-400">Resolution</label>
                  <input placeholder="e.g. 50 MP" value={form.resolution} onChange={e => setForm(f => ({ ...f, resolution: e.target.value }))}
                    className="form-input bg-[#111] border-[#333] text-white" />
                </div>
              </div>

              <div>
                <label className="form-label text-gray-400">Description</label>
                <textarea rows={3} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  className="form-input bg-[#111] border-[#333] text-white resize-none" />
              </div>
              <div>
                <label className="form-label text-gray-400">Story Behind the Shot</label>
                <textarea rows={3} value={form.story} onChange={e => setForm(f => ({ ...f, story: e.target.value }))}
                  className="form-input bg-[#111] border-[#333] text-white resize-none" />
              </div>
              <div>
                <label className="form-label text-gray-400">Tags (comma-separated)</label>
                <input value={form.tags} onChange={e => setForm(f => ({ ...f, tags: e.target.value }))}
                  className="form-input bg-[#111] border-[#333] text-white" placeholder="landscape, india, himalaya" />
              </div>

              {/* Flags */}
              <div className="flex flex-wrap gap-6">
                {[
                  { key: 'featured', label: 'Featured' },
                  { key: 'bestSeller', label: 'Best Seller' },
                  { key: 'limitedEdition', label: 'Limited Edition' },
                ].map(({ key, label }) => (
                  <label key={key} className="flex items-center gap-2 cursor-pointer">
                    <div
                      onClick={() => setForm(f => ({ ...f, [key]: !f[key] }))}
                      className={`w-5 h-5 border flex items-center justify-center transition-colors ${
                        form[key] ? 'bg-accent border-accent' : 'border-[#444]'
                      }`}
                    >
                      {form[key] && <Check size={12} className="text-primary" />}
                    </div>
                    <span className="text-gray-300 text-sm">{label}</span>
                  </label>
                ))}
              </div>

              {/* Edition settings */}
              {form.limitedEdition && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="form-label text-gray-400">Edition Size</label>
                    <input type="number" value={form.editionSize} onChange={e => setForm(f => ({ ...f, editionSize: e.target.value }))}
                      className="form-input bg-[#111] border-[#333] text-white" />
                  </div>
                  <div>
                    <label className="form-label text-gray-400">Editions Sold</label>
                    <input type="number" value={form.editionSold} onChange={e => setForm(f => ({ ...f, editionSold: e.target.value }))}
                      className="form-input bg-[#111] border-[#333] text-white" />
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4 border-t border-[#2a2a2a]">
                <button type="button" onClick={() => setShowForm(false)} className="btn-secondary text-gray-300 border-[#444]">Cancel</button>
                <button type="submit" disabled={saving} className="btn-gold min-w-[120px]">
                  {saving ? 'Saving...' : editId ? 'Save Changes' : 'Create Photo'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AdminPhotosPage;
