import api from './api';

export const bookingService = {
  create: async (formData) => {
    const { data } = await api.post('/bookings', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return data;
  },

  // Admin
  getAll: async (params = {}) => {
    const { data } = await api.get('/bookings', { params });
    return data;
  },

  getById: async (id) => {
    const { data } = await api.get(`/bookings/${id}`);
    return data;
  },

  updateStatus: async (id, statusData) => {
    const { data } = await api.patch(`/bookings/${id}/status`, statusData);
    return data;
  },

  delete: async (id) => {
    const { data } = await api.delete(`/bookings/${id}`);
    return data;
  }
};
