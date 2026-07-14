import api from './api';

export const serviceService = {
  getAll: async () => {
    const { data } = await api.get('/services');
    return data;
  },

  getBySlug: async (slug) => {
    const { data } = await api.get(`/services/${slug}`);
    return data;
  },

  // Admin
  create: async (formData) => {
    const { data } = await api.post('/services', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return data;
  },

  update: async (id, formData) => {
    const { data } = await api.put(`/services/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return data;
  },

  delete: async (id) => {
    const { data } = await api.delete(`/services/${id}`);
    return data;
  }
};
