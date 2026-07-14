import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2, X } from 'lucide-react';
import { frameService, sizeService } from '../../services/frameService';
import { finishService, glassService, mountService } from '../../services/configuratorService';

// ─── Generic inline form table ────────────────────────────────────────────────
const ConfigSection = ({ title, items, fields, onAdd, onUpdate, onDelete, loading, newRow, setNewRow, editRow, setEditRow }) => (
  <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg overflow-hidden">
    <div className="flex items-center justify-between p-5 border-b border-[#2a2a2a]">
      <h3 className="font-display text-white text-lg">{title}</h3>
    </div>
    {loading ? (
      <div className="p-6 space-y-3">{[...Array(3)].map((_, i) => <div key={i} className="skeleton h-10" />)}</div>
    ) : (
      <div className="p-4 space-y-2">
        {items.map(item => (
          <div key={item.id} className="flex items-center gap-3">
            {editRow?.id === item.id ? (
              <>
                {fields.map(f => (
                  <input
                    key={f.key}
                    type={f.type || 'text'}
                    value={editRow[f.key] ?? ''}
                    onChange={e => setEditRow(r => ({ ...r, [f.key]: e.target.value }))}
                    placeholder={f.label}
                    className="form-input bg-[#111] border-[#333] text-white text-sm flex-1 py-1.5"
                  />
                ))}
                <button onClick={() => onUpdate(editRow)} className="text-accent hover:text-white text-sm px-2 py-1 border border-accent">Save</button>
                <button onClick={() => setEditRow(null)} className="text-gray-500 hover:text-white text-sm"><X size={16} /></button>
              </>
            ) : (
              <>
                {fields.map(f => (
                  <span key={f.key} className="flex-1 text-sm text-gray-300">
                    {f.key === 'price' ? `₹${Number(item[f.key]).toLocaleString('en-IN')}` : item[f.key]}
                  </span>
                ))}
                <button onClick={() => setEditRow({ ...item })} className="p-1.5 text-gray-400 hover:text-white"><Edit2 size={14} /></button>
                <button onClick={() => onDelete(item.id)} className="p-1.5 text-gray-600 hover:text-red-400"><Trash2 size={14} /></button>
              </>
            )}
          </div>
        ))}

        {/* New row */}
        <div className="flex items-center gap-3 border-t border-[#2a2a2a] pt-3 mt-3">
          {fields.map(f => (
            <input
              key={f.key}
              type={f.type || 'text'}
              value={newRow[f.key] ?? ''}
              onChange={e => setNewRow(r => ({ ...r, [f.key]: e.target.value }))}
              placeholder={f.label}
              className="form-input bg-[#111] border-[#333] text-white text-sm flex-1 py-1.5"
            />
          ))}
          <button onClick={() => onAdd(newRow)} className="flex items-center gap-1.5 text-sm bg-accent text-primary px-3 py-1.5 whitespace-nowrap hover:opacity-90 transition-opacity">
            <Plus size={14} /> Add
          </button>
        </div>
      </div>
    )}
  </div>
);

// ─── Main Page ────────────────────────────────────────────────────────────────
const AdminConfigPage = () => {
  // Sizes
  const [sizes, setSizes] = useState([]);
  const [sizeNew, setSizeNew] = useState({ label: '', width: '', height: '', basePrice: '' });
  const [sizeEdit, setSizeEdit] = useState(null);
  const [loadingSizes, setLoadingSizes] = useState(true);

  // Finishes
  const [finishes, setFinishes] = useState([]);
  const [finishNew, setFinishNew] = useState({ name: '', price: '' });
  const [finishEdit, setFinishEdit] = useState(null);
  const [loadingFinishes, setLoadingFinishes] = useState(true);

  // Frames
  const [frames, setFrames] = useState([]);
  const [frameNew, setFrameNew] = useState({ name: '', color: '', material: 'Wood', price: '' });
  const [frameEdit, setFrameEdit] = useState(null);
  const [loadingFrames, setLoadingFrames] = useState(true);

  // Glass
  const [glass, setGlass] = useState([]);
  const [glassNew, setGlassNew] = useState({ name: '', price: '' });
  const [glassEdit, setGlassEdit] = useState(null);
  const [loadingGlass, setLoadingGlass] = useState(true);

  // Mounts
  const [mounts, setMounts] = useState([]);
  const [mountNew, setMountNew] = useState({ name: '', price: '' });
  const [mountEdit, setMountEdit] = useState(null);
  const [loadingMounts, setLoadingMounts] = useState(true);

  const loadAll = async () => {
    setLoadingSizes(true); setLoadingFinishes(true); setLoadingFrames(true); setLoadingGlass(true); setLoadingMounts(true);
    const [szR, fnR, frR, glR, mnR] = await Promise.all([
      sizeService.getAll(), finishService.getAll(), frameService.getAll(), glassService.getAll(), mountService.getAll(),
    ]);
    setSizes(szR.data || []); setLoadingSizes(false);
    setFinishes(fnR.data || []); setLoadingFinishes(false);
    setFrames(frR.data || []); setLoadingFrames(false);
    setGlass(glR.data || []); setLoadingGlass(false);
    setMounts(mnR.data || []); setLoadingMounts(false);
  };

  useEffect(() => { loadAll(); }, []);

  // ── Sizes ──
  const addSize = async (row) => {
    if (!row.label) return;
    try { await sizeService.create({ ...row, width: Number(row.width), height: Number(row.height), basePrice: Number(row.basePrice) }); setSizeNew({ label: '', width: '', height: '', basePrice: '' }); loadAll(); } catch (e) { console.error(e); }
  };
  const updateSize = async (row) => {
    try { await sizeService.update(row.id, { ...row, width: Number(row.width), height: Number(row.height), basePrice: Number(row.basePrice) }); setSizeEdit(null); loadAll(); } catch (e) { console.error(e); }
  };
  const deleteSize = async (id) => { if (!window.confirm('Delete?')) return; try { await sizeService.delete(id); loadAll(); } catch (e) { console.error(e); } };

  // ── Finishes ──
  const addFinish = async (row) => {
    if (!row.name) return;
    try { await finishService.create({ ...row, price: Number(row.price) }); setFinishNew({ name: '', price: '' }); loadAll(); } catch (e) { console.error(e); }
  };
  const updateFinish = async (row) => {
    try { await finishService.update(row.id, { ...row, price: Number(row.price) }); setFinishEdit(null); loadAll(); } catch (e) { console.error(e); }
  };
  const deleteFinish = async (id) => { if (!window.confirm('Delete?')) return; try { await finishService.delete(id); loadAll(); } catch (e) { console.error(e); } };

  // ── Frames ──
  const addFrame = async (row) => {
    if (!row.name) return;
    try { await frameService.create({ ...row, price: Number(row.price) }); setFrameNew({ name: '', color: '', material: 'Wood', price: '' }); loadAll(); } catch (e) { console.error(e); }
  };
  const updateFrame = async (row) => {
    try { await frameService.update(row.id, { ...row, price: Number(row.price) }); setFrameEdit(null); loadAll(); } catch (e) { console.error(e); }
  };
  const deleteFrame = async (id) => { if (!window.confirm('Delete?')) return; try { await frameService.delete(id); loadAll(); } catch (e) { console.error(e); } };

  // ── Glass ──
  const addGlass = async (row) => {
    if (!row.name) return;
    try { await glassService.create({ ...row, price: Number(row.price) }); setGlassNew({ name: '', price: '' }); loadAll(); } catch (e) { console.error(e); }
  };
  const updateGlass = async (row) => {
    try { await glassService.update(row.id, { ...row, price: Number(row.price) }); setGlassEdit(null); loadAll(); } catch (e) { console.error(e); }
  };
  const deleteGlass = async (id) => { if (!window.confirm('Delete?')) return; try { await glassService.delete(id); loadAll(); } catch (e) { console.error(e); } };

  // ── Mounts ──
  const addMount = async (row) => {
    if (!row.name) return;
    try { await mountService.create({ ...row, price: Number(row.price) }); setMountNew({ name: '', price: '' }); loadAll(); } catch (e) { console.error(e); }
  };
  const updateMount = async (row) => {
    try { await mountService.update(row.id, { ...row, price: Number(row.price) }); setMountEdit(null); loadAll(); } catch (e) { console.error(e); }
  };
  const deleteMount = async (id) => { if (!window.confirm('Delete?')) return; try { await mountService.delete(id); loadAll(); } catch (e) { console.error(e); } };

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-2xl font-display text-white">Print Configurator Settings</h1>
        <p className="text-gray-400 text-sm mt-1">Manage sizes, finishes, frames, glass, and mount options. Prices update live in the store.</p>
      </div>

      <ConfigSection
        title="Print Sizes"
        items={sizes} loading={loadingSizes}
        newRow={sizeNew} setNewRow={setSizeNew}
        editRow={sizeEdit} setEditRow={setSizeEdit}
        fields={[
          { key: 'label', label: 'Label (e.g. 8×10)' },
          { key: 'width', label: 'Width (in)', type: 'number' },
          { key: 'height', label: 'Height (in)', type: 'number' },
          { key: 'basePrice', label: 'Add-on Price (₹)', type: 'number' },
        ]}
        onAdd={addSize} onUpdate={updateSize} onDelete={deleteSize}
      />

      <ConfigSection
        title="Print Finishes"
        items={finishes} loading={loadingFinishes}
        newRow={finishNew} setNewRow={setFinishNew}
        editRow={finishEdit} setEditRow={setFinishEdit}
        fields={[
          { key: 'name', label: 'Name (e.g. Matte)' },
          { key: 'price', label: 'Add-on Price (₹)', type: 'number' },
        ]}
        onAdd={addFinish} onUpdate={updateFinish} onDelete={deleteFinish}
      />

      <ConfigSection
        title="Frames"
        items={frames} loading={loadingFrames}
        newRow={frameNew} setNewRow={setFrameNew}
        editRow={frameEdit} setEditRow={setFrameEdit}
        fields={[
          { key: 'name', label: 'Frame Name (e.g. Walnut)' },
          { key: 'color', label: 'Colour' },
          { key: 'material', label: 'Material (Wood/Metal)' },
          { key: 'price', label: 'Add-on Price (₹)', type: 'number' },
        ]}
        onAdd={addFrame} onUpdate={updateFrame} onDelete={deleteFrame}
      />

      <ConfigSection
        title="Glass Options"
        items={glass} loading={loadingGlass}
        newRow={glassNew} setNewRow={setGlassNew}
        editRow={glassEdit} setEditRow={setGlassEdit}
        fields={[
          { key: 'name', label: 'Name (e.g. Anti-Glare Glass)' },
          { key: 'price', label: 'Add-on Price (₹)', type: 'number' },
        ]}
        onAdd={addGlass} onUpdate={updateGlass} onDelete={deleteGlass}
      />

      <ConfigSection
        title="Mount Options"
        items={mounts} loading={loadingMounts}
        newRow={mountNew} setNewRow={setMountNew}
        editRow={mountEdit} setEditRow={setMountEdit}
        fields={[
          { key: 'name', label: 'Name (e.g. With Mount)' },
          { key: 'price', label: 'Add-on Price (₹)', type: 'number' },
        ]}
        onAdd={addMount} onUpdate={updateMount} onDelete={deleteMount}
      />
    </div>
  );
};

export default AdminConfigPage;
