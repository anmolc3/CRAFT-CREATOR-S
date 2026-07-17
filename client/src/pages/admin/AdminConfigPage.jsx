import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, X } from 'lucide-react';
import { configuratorService } from '../../services/configuratorService';

// Generic config list view
const ConfigSection = ({ title, items, fields, onAdd, onUpdate, onDelete, loading, newRow, setNewRow, editRow, setEditRow }) => (
  <div className="bg-[#141414] border border-[#222] rounded-2xl overflow-hidden shadow-lg text-xs">
    <div className="flex items-center justify-between p-5 border-b border-[#222] bg-[#1c1c1c]">
      <h3 className="font-display text-white text-base font-bold">{title}</h3>
    </div>
    {loading ? (
      <div className="p-6 space-y-3">{[...Array(3)].map((_, i) => <div key={i} className="h-10 bg-white/5 animate-pulse rounded-lg" />)}</div>
    ) : (
      <div className="p-6 space-y-4">
        {items.map(item => (
          <div key={item.id} className="flex items-center gap-3 border-b border-[#222]/40 pb-3 last:border-0 last:pb-0">
            {editRow?.id === item.id ? (
              <>
                {fields.map(f => (
                  <input
                    key={f.key}
                    type={f.type || 'text'}
                    value={editRow[f.key] ?? ''}
                    onChange={e => setEditRow(r => ({ ...r, [f.key]: e.target.value }))}
                    placeholder={f.label}
                    className="bg-[#1e1e1e] border border-[#333] text-white text-xs rounded-xl px-3 py-2 flex-1 focus:outline-none focus:border-accent"
                  />
                ))}
                <button 
                  onClick={() => onUpdate(editRow)} 
                  className="text-primary bg-accent hover:opacity-90 font-bold px-3 py-2 rounded-xl transition-opacity uppercase tracking-wider text-[10px]"
                >
                  Save
                </button>
                <button 
                  onClick={() => setEditRow(null)} 
                  className="text-gray-500 hover:text-white p-2"
                >
                  <X size={16} />
                </button>
              </>
            ) : (
              <>
                {fields.map(f => (
                  <span key={f.key} className="flex-1 text-xs text-gray-300">
                    {f.key === 'basePrice' || f.key === 'price' ? `₹${Number(item[f.key]).toLocaleString('en-IN')}` : item[f.key]}
                  </span>
                ))}
                <button 
                  onClick={() => setEditRow({ ...item })} 
                  className="p-2 border border-[#333] hover:border-gray-500 text-gray-400 hover:text-white rounded-lg transition-colors"
                >
                  <Edit2 size={12} />
                </button>
                <button 
                  onClick={() => onDelete(item.id)} 
                  className="p-2 border border-[#333] hover:border-red-500 text-gray-500 hover:text-red-400 rounded-lg transition-colors"
                >
                  <Trash2 size={12} />
                </button>
              </>
            )}
          </div>
        ))}

        {/* Add Row */}
        <div className="flex items-center gap-3 border-t border-[#222] pt-4 mt-4">
          {fields.map(f => (
            <input
              key={f.key}
              type={f.type || 'text'}
              value={newRow[f.key] ?? ''}
              onChange={e => setNewRow(r => ({ ...r, [f.key]: e.target.value }))}
              placeholder={f.label}
              className="bg-[#1e1e1e] border border-[#333] text-white text-xs rounded-xl px-3 py-2 flex-1 focus:outline-none focus:border-accent"
            />
          ))}
          <button 
            onClick={() => onAdd(newRow)} 
            className="flex items-center gap-1.5 bg-accent hover:opacity-90 font-bold text-primary px-4 py-2 rounded-xl transition-opacity uppercase tracking-wider text-[10px]"
          >
            <Plus size={14} /> Add Option
          </button>
        </div>
      </div>
    )}
  </div>
);

const AdminConfigPage = () => {
  // Sizes
  const [sizes, setSizes] = useState([]);
  const [sizeNew, setSizeNew] = useState({ label: '', width: '', height: '', basePrice: '' });
  const [sizeEdit, setSizeEdit] = useState(null);
  const [loadingSizes, setLoadingSizes] = useState(true);

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
    setLoadingSizes(true); 
    setLoadingGlass(true); 
    setLoadingMounts(true);
    
    try {
      const [szR, glR, mnR] = await Promise.all([
        configuratorService.getSizes(),
        configuratorService.getGlassOptions(),
        configuratorService.getMountOptions(),
      ]);
      setSizes(szR.data.data || []);
      setGlass(glR.data.data || []);
      setMounts(mnR.data.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingSizes(false); 
      setLoadingGlass(false); 
      setLoadingMounts(false);
    }
  };

  useEffect(() => { loadAll(); }, []);

  // ── Sizes ──
  const addSize = async (row) => {
    if (!row.label) return;
    try { 
      await configuratorService.createSize({ 
        ...row, 
        width: Number(row.width), 
        height: Number(row.height), 
        basePrice: Number(row.basePrice) 
      }); 
      setSizeNew({ label: '', width: '', height: '', basePrice: '' }); 
      loadAll(); 
    } catch (e) { console.error(e); }
  };
  
  const updateSize = async (row) => {
    try { 
      await configuratorService.updateSize(row.id, { 
        ...row, 
        width: Number(row.width), 
        height: Number(row.height), 
        basePrice: Number(row.basePrice) 
      }); 
      setSizeEdit(null); 
      loadAll(); 
    } catch (e) { console.error(e); }
  };
  
  const deleteSize = async (id) => { 
    if (!window.confirm('Delete this print size?')) return; 
    try { 
      await configuratorService.deleteSize(id); 
      loadAll(); 
    } catch (e) { console.error(e); } 
  };

  // ── Glass ──
  const addGlass = async (row) => {
    if (!row.name) return;
    try { 
      await configuratorService.createGlass({ 
        ...row, 
        price: Number(row.price) 
      }); 
      setGlassNew({ name: '', price: '' }); 
      loadAll(); 
    } catch (e) { console.error(e); }
  };
  
  const updateGlass = async (row) => {
    try { 
      await configuratorService.updateGlass(row.id, { 
        ...row, 
        price: Number(row.price) 
      }); 
      setGlassEdit(null); 
      loadAll(); 
    } catch (e) { console.error(e); }
  };
  
  const deleteGlass = async (id) => { 
    if (!window.confirm('Delete this glass option?')) return; 
    try { 
      await configuratorService.deleteGlass(id); 
      loadAll(); 
    } catch (e) { console.error(e); } 
  };

  // ── Mounts ──
  const addMount = async (row) => {
    if (!row.name) return;
    try { 
      await configuratorService.createMount({ 
        ...row, 
        price: Number(row.price) 
      }); 
      setMountNew({ name: '', price: '' }); 
      loadAll(); 
    } catch (e) { console.error(e); }
  };
  
  const updateMount = async (row) => {
    try { 
      await configuratorService.updateMount(row.id, { 
        ...row, 
        price: Number(row.price) 
      }); 
      setMountEdit(null); 
      loadAll(); 
    } catch (e) { console.error(e); }
  };
  
  const deleteMount = async (id) => { 
    if (!window.confirm('Delete this mount option?')) return; 
    try { 
      await configuratorService.deleteMount(id); 
      loadAll(); 
    } catch (e) { console.error(e); } 
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-display text-white font-bold">Print Configurator Options</h1>
        <p className="text-gray-400 text-xs mt-1">Manage sizes, glass finishes, and mount boards. Pricing edits update live in the configurator.</p>
      </div>

      <ConfigSection
        title="Frame / Print Sizes"
        items={sizes} 
        loading={loadingSizes}
        newRow={sizeNew} 
        setNewRow={setSizeNew}
        editRow={sizeEdit} 
        setEditRow={setSizeEdit}
        fields={[
          { key: 'label', label: 'Label (e.g. 8×10)' },
          { key: 'width', label: 'Width (in)', type: 'number' },
          { key: 'height', label: 'Height (in)', type: 'number' },
          { key: 'basePrice', label: 'Base Price (₹)', type: 'number' },
        ]}
        onAdd={addSize} 
        onUpdate={updateSize} 
        onDelete={deleteSize}
      />

      <ConfigSection
        title="Glass Finishes"
        items={glass} 
        loading={loadingGlass}
        newRow={glassNew} 
        setNewRow={setGlassNew}
        editRow={glassEdit} 
        setEditRow={setSizeEdit} // using generic editing
        fields={[
          { key: 'name', label: 'Glass Name (e.g. Anti-Glare Glass)' },
          { key: 'price', label: 'Add-on Price (₹)', type: 'number' },
        ]}
        onAdd={addGlass} 
        onUpdate={updateGlass} 
        onDelete={deleteGlass}
      />

      <ConfigSection
        title="Mount Boards"
        items={mounts} 
        loading={loadingMounts}
        newRow={mountNew} 
        setNewRow={setMountNew}
        editRow={mountEdit} 
        setEditRow={setSizeEdit} // using generic editing
        fields={[
          { key: 'name', label: 'Mount Board Name (e.g. Double Mount)' },
          { key: 'price', label: 'Add-on Price (₹)', type: 'number' },
        ]}
        onAdd={addMount} 
        onUpdate={updateMount} 
        onDelete={deleteMount}
      />
    </div>
  );
};

export default AdminConfigPage;
