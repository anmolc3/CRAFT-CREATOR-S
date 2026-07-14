import React, { useState, useEffect } from 'react';
import { Edit, Trash, Calendar, CheckCircle, Clock, XCircle } from 'lucide-react';
import { bookingService } from '../../services/bookingService';

const AdminBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const { data } = await bookingService.getAll();
      setBookings(data || []);
    } catch (error) {
      console.error('Error fetching bookings', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await bookingService.updateStatus(id, { status: newStatus });
      setBookings(bookings.map(b => b.id === id ? { ...b, status: newStatus } : b));
    } catch (error) {
      console.error('Error updating status', error);
      alert('Failed to update status');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this booking request?')) return;
    try {
      await bookingService.delete(id);
      setBookings(bookings.filter(b => b.id !== id));
    } catch (error) {
      console.error('Error deleting booking', error);
      alert('Failed to delete booking');
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed': return <CheckCircle size={16} className="text-green-500" />;
      case 'completed': return <CheckCircle size={16} className="text-blue-500" />;
      case 'cancelled': return <XCircle size={16} className="text-red-500" />;
      case 'pending':
      default: return <Clock size={16} className="text-yellow-500" />;
    }
  };

  if (loading) return <div className="text-white p-8">Loading bookings...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-display text-white mb-1">Bookings & Inquiries</h2>
          <p className="text-gray-400 text-sm">Manage client booking requests and session scheduling.</p>
        </div>
      </div>

      <div className="bg-[#1a1a1a] rounded-xl border border-[#2a2a2a] overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-[#222] text-xs uppercase tracking-wider text-gray-400 font-medium">
            <tr>
              <th className="px-6 py-4">Client</th>
              <th className="px-6 py-4">Service / Event</th>
              <th className="px-6 py-4">Date & Location</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#2a2a2a]">
            {bookings.map((booking) => (
              <tr key={booking.id} className="hover:bg-[#222] transition-colors">
                <td className="px-6 py-4">
                  <div className="text-white font-medium">{booking.name}</div>
                  <div className="text-gray-500 text-xs mt-1">{booking.email}</div>
                  <div className="text-gray-500 text-xs">{booking.phone}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-gray-300 font-medium">
                    {booking.service?.title || booking.eventType || 'Not Specified'}
                  </div>
                  <div className="text-gray-500 text-xs mt-1">
                    {booking.guests ? `${booking.guests} Guests` : ''} 
                    {booking.budget ? ` • ₹${booking.budget.toLocaleString('en-IN')}` : ''}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-gray-300">
                    <Calendar size={14} className="text-gray-500" />
                    {booking.preferredDate ? new Date(booking.preferredDate).toLocaleDateString() : 'TBD'}
                  </div>
                  <div className="text-gray-500 text-xs mt-1 ml-6">{booking.location || 'Location TBD'}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(booking.status)}
                    <select 
                      value={booking.status}
                      onChange={(e) => handleStatusChange(booking.id, e.target.value)}
                      className="bg-transparent text-sm text-gray-300 focus:outline-none capitalize cursor-pointer hover:text-white"
                    >
                      <option value="pending" className="bg-[#1a1a1a]">Pending</option>
                      <option value="confirmed" className="bg-[#1a1a1a]">Confirmed</option>
                      <option value="completed" className="bg-[#1a1a1a]">Completed</option>
                      <option value="cancelled" className="bg-[#1a1a1a]">Cancelled</option>
                    </select>
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-gray-400 hover:text-white mx-2 transition-colors">
                    <Edit size={18} />
                  </button>
                  <button 
                    onClick={() => handleDelete(booking.id)}
                    className="text-gray-400 hover:text-red-500 mx-2 transition-colors"
                  >
                    <Trash size={18} />
                  </button>
                </td>
              </tr>
            ))}
            {bookings.length === 0 && (
              <tr>
                <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                  No booking requests found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminBookingsPage;
