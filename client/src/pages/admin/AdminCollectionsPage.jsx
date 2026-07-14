import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2, X, Image } from 'lucide-react';
import { collectionService } from '../../services/collectionService';
import { categoryService } from '../../services/categoryService';

// ─── Generic CRUD panel ────────────────────────────────────────────────────────
const CrudPanel = ({ title, items, columns, onAdd, onEdit, onDelete, loading }) => (
  <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg overflow-hidden">
    <div className="flex items-center justify-between p-5 border-b border-[#2a2a2a]">
      <h3 className="font-display text-white text-lg">{title}</h3>
      <button onClick={onAdd} className="flex items-center gap-2 text-sm bg-accent text-primary px-3 py-1.5 hover:opacity-90 transition-opacity">
        <Plus size={14} /> Add
      </button>
    </div>
    {loading ? (
      <div className="p-6 space-y-3">{[...Array(3)].map((_, i) => <div key={i} className="skeleton h-10" />)}</div>
    ) : (
      <table className="w-full text-sm font-body">
        <thead className="text-gray-500 text-xs uppercase tracking-widest bg-[#111]">
          <tr>{columns.map(c => <th key={c.key} className="text-left px-4 py-3">{c.label}</th>)}<th className="text-right px-4 py-3">Actions</th></tr>
        </thead>
        <tbody className="divide-y divide-[#222]">
          {items.map(item => (
            <tr key={item.id} className="hover:bg-[#1f1f1f]">
              {columns.map(c => (
                <td key={c.key} className="px-4 py-3 text-gray-300">
                  {c.render ? c.render(item) : item[c.key] ?? '—'}
                </td>
              ))}
              <td className="px-4 py-3 text-right">
                <div className="flex items-center justify-end gap-2">
                  <button onClick={() => onEdit(item)} className="p-1.5 text-gray-400 hover:text-white transition-colors"><Edit2 size={14} /></button>
                  <button onClick={() => onDelete(item.id)} className="p-1.5 text-gray-600 hover:text-red-400 transition-colors"><Trash2 size={14} /></button>
                </div>
              </td>
            </tr>
          ))}
          {items.length === 0 && <tr><td colSpan={columns.length + 1} className="text-center py-10 text-gray-600">No items yet.</td></tr>}
        </tbody>
      </table>
    )}
  </div>
);

// ─── Modal ────────────────────────────────────────────────────────────────────
const Modal = ({ title, onClose, onSubmit, saving, children }) => (
  <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
      className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg w-full max-w-lg">
      <div className="flex items-center justify-between p-5 border-b border-[#2a2a2a]">
        <h3 className="font-display text-white text-lg">{title}</h3>
        <button onClick={onClose}><X size={20} className="text-gray-400 hover:text-white" /></button>
      </div>
      <form onSubmit={onSubmit} className="p-5 space-y-4">
        {children}
        <div className="flex justify-end gap-3 pt-3 border-t border-[#2a2a2a]">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-gray-400 border border-[#444] hover:border-gray-300 transition-colors">Cancel</button>
          <button type="submit" disabled={saving} className="btn-gold px-6">{saving ? 'Saving…' : 'Save'}</button>
        </div>
      </form>
    </motion.div>
  </div>
);

// ─── Main Page ────────────────────────────────────────────────────────────────
const AdminCollectionsPage = () => {
  const [collections, setCollections] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loadingCol, setLoadingCol] = useState(true);
  const [loadingCat, setLoadingCat] = useState(true);

  // Collection form
  const [colModal, setColModal] = useState(false);
  const [colEdit, setColEdit] = useState(null);
  const [colForm, setColForm] = useState({ name: '', description: '', imageUrl: '' });
  const [colFile, setColFile] = useState(null);
  const [colPreview, setColPreview] = useState(null);
  const [savingCol, setSavingCol] = useState(false);

  // Category form
  const [catModal, setCatModal] = useState(false);
  const [catEdit, setCatEdit] = useState(null);
  const [catForm, setCatForm] = useState({ name: '', description: '' });
  const [savingCat, setSavingCat] = useState(false);

  const loadCollections = async () => {
    setLoadingCol(true);
    try { const r = await collectionService.getAll(); setCollections(r.data || []); }
    catch (e) { console.error(e); } finally { setLoadingCol(false); }
  };

  const loadCategories = async () => {
    setLoadingCat(true);
    try { const r = await categoryService.getAll(); setCategories(r.data || []); }
    catch (e) { console.error(e); } finally { setLoadingCat(false); }
  };

  useEffect(() => { loadCollections(); loadCategories(); }, []);

  // ── Collections ──
  const openAddCol = () => { setColEdit(null); setColForm({ name: '', description: '', imageUrl: '' }); setColFile(null); setColPreview(null); setColModal(true); };
  const openEditCol = (c) => {
    setColEdit(c);
    setColForm({ name: c.name || '', description: c.description || '', imageUrl: c.imageUrl || '' });
    setColPreview(c.imageUrl || null);
    setColFile(null);
    setColModal(true);
  };
  const handleColFile = (e) => { const f = e.target.files[0]; if (!f) return; setColFile(f); setColPreview(URL.createObjectURL(f)); };

  const submitCol = async (e) => {
    e.preventDefault();
    setSavingCol(true);
    try {
      const fd = new FormData();
      Object.entries(colForm).forEach(([k, v]) => fd.append(k, v));
      if (colFile) fd.append('image', colFile);
      if (colEdit) await collectionService.update(colEdit.id, fd);
      else await collectionService.create(fd);
      setColModal(false);
      loadCollections();
    } catch (e) { console.error(e); } finally { setSavingCol(false); }
  };

  const deleteCol = async (id) => {
    if (!window.confirm('Delete this collection?')) return;
    try { await collectionService.delete(id); loadCollections(); } catch (e) { console.error(e); }
  };

  // ── Categories ──
  const openAddCat = () => { setCatEdit(null); setCatForm({ name: '', description: '' }); setCatModal(true); };
  const openEditCat = (c) => { setCatEdit(c); setCatForm({ name: c.name || '', description: c.description || '' }); setCatModal(true); };

  const submitCat = async (e) => {
    e.preventDefault();
    setSavingCat(true);
    try {
      if (catEdit) await categoryService.update(catEdit.id, catForm);
      else await categoryService.create(catForm);
      setCatModal(false);
      loadCategories();
    } catch (e) { console.error(e); } finally { setSavingCat(false); }
  };

  const deleteCat = async (id) => {
    if (!window.confirm('Delete this category?')) return;
    try { await categoryService.delete(id); loadCategories(); } catch (e) { console.error(e); }
  };

  return (
    <div className="p-8 space-y-10">
      <div>
        <h1 className="text-2xl font-display text-white">Collections & Categories</h1>
        <p className="text-gray-400 text-sm mt-1">Curate and organise your portfolio</p>
      </div>

      {/* Collections */}
      <CrudPanel
        title="Collections"
        items={collections}
        loading={loadingCol}
        onAdd={openAddCol}
        onEdit={openEditCol}
        onDelete={deleteCol}
        columns={[
          { key: 'imageUrl', label: 'Cover', render: c => c.imageUrl ? <img src={c.imageUrl} alt="" className="w-10 h-8 object-cover rounded" /> : <Image size={16} className="text-gray-600" /> },
          { key: 'name', label: 'Name', render: c => <span className="text-white font-medium">{c.name}</span> },
          { key: 'slug', label: 'Slug' },
          { key: '_count', label: 'Photos', render: c => c._count?.photos ?? '—' },
        ]}
      />

      {/* Categories */}
      <CrudPanel
        title="Categories"
        items={categories}
        loading={loadingCat}
        onAdd={openAddCat}
        onEdit={openEditCat}
        onDelete={deleteCat}
        columns={[
          { key: 'name', label: 'Name', render: c => <span className="text-white font-medium">{c.name}</span> },
          { key: 'slug', label: 'Slug' },
          { key: 'description', label: 'Description' },
        ]}
      />

      {/* Collection Modal */}
      {colModal && (
        <Modal title={colEdit ? 'Edit Collection' : 'Add Collection'} onClose={() => setColModal(false)} onSubmit={submitCol} saving={savingCol}>
          <div>
            <label className="form-label text-gray-400">Name *</label>
            <input required value={colForm.name} onChange={e => setColForm(f => ({ ...f, name: e.target.value }))}
              className="form-input bg-[#111] border-[#333] text-white" />
          </div>
          <div>
            <label className="form-label text-gray-400">Description</label>
            <textarea rows={3} value={colForm.description} onChange={e => setColForm(f => ({ ...f, description: e.target.value }))}
              className="form-input bg-[#111] border-[#333] text-white resize-none" />
          </div>
          <div>
            <label className="form-label text-gray-400">Cover Image</label>
            <div className="flex items-center gap-3">
              {colPreview && <img src={colPreview} alt="" className="w-16 h-12 object-cover rounded border border-[#333]" />}
              <label className="flex-1 border border-dashed border-[#333] p-3 text-center text-sm text-gray-400 cursor-pointer hover:border-accent transition-colors">
                Upload Cover <input type="file" accept="image/*" onChange={handleColFile} className="hidden" />
              </label>
            </div>
          </div>
        </Modal>
      )}

      {/* Category Modal */}
      {catModal && (
        <Modal title={catEdit ? 'Edit Category' : 'Add Category'} onClose={() => setCatModal(false)} onSubmit={submitCat} saving={savingCat}>
          <div>
            <label className="form-label text-gray-400">Name *</label>
            <input required value={catForm.name} onChange={e => setCatForm(f => ({ ...f, name: e.target.value }))}
              className="form-input bg-[#111] border-[#333] text-white" />
          </div>
          <div>
            <label className="form-label text-gray-400">Description</label>
            <input value={catForm.description} onChange={e => setCatForm(f => ({ ...f, description: e.target.value }))}
              className="form-input bg-[#111] border-[#333] text-white" />
          </div>
        </Modal>
      )}
    </div>
  );
};

export default AdminCollectionsPage;
