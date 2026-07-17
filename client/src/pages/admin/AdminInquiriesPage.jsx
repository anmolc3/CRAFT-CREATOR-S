import React, { useEffect, useState } from 'react';
import { inquiryService } from '../../services/inquiryService';
import { Edit2, Eye, Trash2, X, AlertCircle } from 'lucide-react';

const AdminInquiriesPage = () => {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  
  // Status editing form states
  const [status, setStatus] = useState('pending');
  const [notes, setNotes] = useState('');
  const [totalEstimate, setTotalEstimate] = useState('0');
  const [saving, setSaving] = useState(false);

  const loadInquiries = async () => {
    try {
      setLoading(true);
      const res = await inquiryService.getInquiries();
      setInquiries(res.data.data || []);
    } catch (e) {
      console.error('Error fetching inquiries:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInquiries();
  }, []);

  const openEditModal = (inq) => {
    setSelectedInquiry(inq);
    setStatus(inq.status || 'pending');
    setNotes(inq.notes || '');
    setTotalEstimate(String(inq.totalEstimate || 0));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await inquiryService.updateInquiry(selectedInquiry.id, {
        status,
        notes,
        totalEstimate: parseInt(totalEstimate) || 0
      });
      setSelectedInquiry(null);
      loadInquiries();
    } catch (err) {
      console.error(err);
      alert('Error updating inquiry status');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this customer inquiry?')) {
      try {
        await inquiryService.deleteInquiry(id);
        loadInquiries();
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex justify-between items-center border-b border-[#222] pb-4">
        <div>
          <h2 className="text-xl font-display text-white font-bold">Customer Inquiries</h2>
          <p className="text-gray-400 text-xs mt-1">Review custom framing orders, manage status updates and pricing estimates</p>
        </div>
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
                <th className="p-4">Customer Details</th>
                <th className="p-4">Frame Choice</th>
                <th className="p-4">Configuration</th>
                <th className="p-4">Artwork Source</th>
                <th className="p-4">Estimate (₹)</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#222] text-gray-300">
              {inquiries.map((inq) => (
                <tr key={inq.id} className="hover:bg-[#1a1a1a] transition-colors">
                  <td className="p-4">
                    <p className="font-bold text-white text-sm">{inq.customerName}</p>
                    <p className="text-gray-500 text-[10px]">{inq.phone} &bull; {inq.email}</p>
                  </td>
                  <td className="p-4">
                    <p className="font-semibold text-white">{inq.frameName || 'Custom border'}</p>
                    <p className="text-gray-500 text-[10px]">Size: {inq.size}</p>
                  </td>
                  <td className="p-4 font-light text-gray-400">
                    <p>Mat: {inq.material} &bull; Col: {inq.color}</p>
                    <p className="text-[10px]">Glass: {inq.glass} &bull; Mount: {inq.mount}</p>
                  </td>
                  <td className="p-4">
                    {inq.photoOption === 'upload' ? (
                      inq.uploadedImageUrl ? (
                        <a 
                          href={`http://localhost:5000${inq.uploadedImageUrl}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-accent hover:underline font-semibold"
                        >
                          <Eye size={12} /> View Upload
                        </a>
                      ) : (
                        <span className="text-gray-500 italic">No file uploaded</span>
                      )
                    ) : (
                      <span className="text-gray-400 uppercase tracking-widest text-[9px] bg-[#222] px-2 py-1 rounded border border-[#333]">Customer Bring</span>
                    )}
                  </td>
                  <td className="p-4 font-bold text-accent">
                    {inq.totalEstimate > 0 ? `₹${inq.totalEstimate}` : 'TBD'}
                  </td>
                  <td className="p-4">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] font-semibold uppercase tracking-wider ${
                      inq.status === 'pending' ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20' :
                      inq.status === 'confirmed' ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20' :
                      inq.status === 'in_progress' ? 'bg-orange-500/10 text-orange-500 border border-orange-500/20' :
                      inq.status === 'completed' ? 'bg-green-500/10 text-green-500 border border-green-500/20' :
                      'bg-red-500/10 text-red-500 border border-red-500/20'
                    }`}>
                      {inq.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => openEditModal(inq)}
                        className="p-2 border border-[#333] hover:border-gray-500 hover:text-white rounded-lg transition-colors"
                        title="Update Inquiry Status"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button 
                        onClick={() => handleDelete(inq.id)}
                        className="p-2 border border-[#333] hover:border-red-500 hover:text-red-400 rounded-lg transition-colors"
                        title="Delete Inquiry Log"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {inquiries.length === 0 && (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-gray-500 italic">No inquiry requests logged.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Edit Status Modal */}
      {selectedInquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#141414] rounded-3xl border border-[#222] w-full max-w-lg p-8 space-y-6 shadow-luxury text-xs text-gray-300 animate-fade-in">
            <div className="flex justify-between items-center border-b border-[#222] pb-3">
              <h3 className="font-display text-lg font-bold text-white">Update Customer Inquiry</h3>
              <button onClick={() => setSelectedInquiry(null)} className="text-gray-400 hover:text-white">
                <X size={20} />
              </button>
            </div>

            {/* Customer specs view */}
            <div className="bg-[#1e1e1e] p-4 rounded-2xl border border-[#333] space-y-2">
              <p className="font-bold text-white">Inquiry Details:</p>
              <div className="grid grid-cols-2 gap-2 text-gray-400">
                <div>Client: <span className="text-white font-medium">{selectedInquiry.customerName}</span></div>
                <div>Choice: <span className="text-white font-medium">{selectedInquiry.frameName}</span></div>
                <div>Size: <span className="text-white font-medium">{selectedInquiry.size}</span></div>
                <div>Glass: <span className="text-white font-medium">{selectedInquiry.glass}</span></div>
              </div>
              {selectedInquiry.uploadedImageUrl && (
                <div className="pt-2">
                  <span className="text-gray-400 block mb-1">Uploaded Image File:</span>
                  <img 
                    src={`http://localhost:5000${selectedInquiry.uploadedImageUrl}`} 
                    alt="Customer Artwork Upload" 
                    className="max-h-24 rounded border border-[#333] object-contain bg-[#111]" 
                  />
                </div>
              )}
            </div>

            <form onSubmit={handleUpdate} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                
                {/* Status Selection */}
                <div className="space-y-1">
                  <label className="text-[10px] uppercase text-gray-500 tracking-widest font-semibold block">Order Status</label>
                  <select 
                    value={status} 
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full bg-[#1e1e1e] border border-[#333] rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-accent"
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                {/* Estimate Price */}
                <div className="space-y-1">
                  <label className="text-[10px] uppercase text-gray-500 tracking-widest font-semibold block">Total estimate (₹)</label>
                  <input 
                    type="number" 
                    value={totalEstimate}
                    onChange={(e) => setTotalEstimate(e.target.value)}
                    placeholder="Enter final quote estimate"
                    className="w-full bg-[#1e1e1e] border border-[#333] rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-accent"
                  />
                </div>

              </div>

              {/* Admin Notes */}
              <div className="space-y-1">
                <label className="text-[10px] uppercase text-gray-500 tracking-widest font-semibold block">Internal Admin Notes</label>
                <textarea 
                  rows="3"
                  value={notes} 
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Discussed custom mounts via WhatsApp. Delivery scheduled for Thursday."
                  className="w-full bg-[#1e1e1e] border border-[#333] rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-accent resize-none"
                />
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t border-[#222]">
                <button 
                  type="button" 
                  onClick={() => setSelectedInquiry(null)}
                  className="px-6 py-2.5 border border-[#333] rounded-full font-semibold uppercase tracking-wider text-[10px] text-gray-400 hover:text-white"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={saving}
                  className="bg-accent hover:bg-white text-primary px-6 py-2.5 rounded-full font-semibold uppercase tracking-wider text-[10px] transition-all shadow-luxury"
                >
                  {saving ? 'Saving...' : 'Update Details'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminInquiriesPage;
