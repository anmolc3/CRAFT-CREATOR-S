import React, { useEffect, useState } from 'react';
import { newsletterService } from '../../services/newsletterService';
import { Trash2, Mail, Download } from 'lucide-react';

const AdminNewsletterPage = () => {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadSubscribers = async () => {
    try {
      setLoading(true);
      const res = await newsletterService.getSubscribers();
      setSubscribers(res.data.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSubscribers();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to remove this email subscriber?')) {
      try {
        await newsletterService.deleteSubscriber(id);
        loadSubscribers();
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
          <h2 className="text-xl font-display text-white font-bold">Newsletter Subscribers</h2>
          <p className="text-gray-400 text-xs mt-1">View list of email accounts registered for framing studio updates</p>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="text-center py-20">
          <div className="w-10 h-10 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      ) : (
        <div className="bg-[#141414] rounded-2xl border border-[#222] overflow-hidden shadow-lg max-w-2xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#1c1c1c] text-gray-400 uppercase tracking-wider font-semibold border-b border-[#222] text-[10px]">
              <tr>
                <th className="p-4">Email Address</th>
                <th className="p-4">Subscribed At</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#222] text-gray-300">
              {subscribers.map((sub) => (
                <tr key={sub.id} className="hover:bg-[#1a1a1a] transition-colors">
                  <td className="p-4 font-bold text-white text-sm flex items-center gap-2">
                    <Mail size={14} className="text-accent/60" />
                    {sub.email}
                  </td>
                  <td className="p-4 text-gray-400">
                    {new Date(sub.subscribedAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}
                  </td>
                  <td className="p-4 text-right">
                    <button 
                      onClick={() => handleDelete(sub.id)}
                      className="p-2 border border-[#333] hover:border-red-500 hover:text-red-400 rounded-lg transition-colors"
                      title="Unsubscribe Email"
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
              {subscribers.length === 0 && (
                <tr>
                  <td colSpan="3" className="p-8 text-center text-gray-500 italic">No newsletter subscribers yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
};

export default AdminNewsletterPage;
