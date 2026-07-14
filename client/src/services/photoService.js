import api from './api';

export const photoService = {
  getAll: async (params = {}) => {
    const { data } = await api.get('/photos', { params });
    return data;
  },
  
  getBySlug: async (slug) => {
    const { data } = await api.get(`/photos/${slug}`);
    return data;
  },
  
  getRelated: async (slug) => {
    const { data } = await api.get(`/photos/${slug}/related`);
    return data;
  },

  // Admin only
  create: async (formData) => {
    const { data } = await api.post('/photos', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return data;
  },

  update: async (id, formData) => {
    const { data } = await api.put(`/photos/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return data;
  },

  delete: async (id) => {
    const { data } = await api.delete(`/photos/${id}`);
    return data;
  }
};
