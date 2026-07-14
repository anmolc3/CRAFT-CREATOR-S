import api from './api';

export const clientGalleryService = {
  // Public
  verifyAndGet: async (slug, password) => {
    const { data } = await api.post(`/client-galleries/verify/${slug}`, { password });
    return data;
  },

  // Admin
  getAll: async () => {
    const { data } = await api.get('/client-galleries');
    return data;
  },

  getById: async (id) => {
    const { data } = await api.get(`/client-galleries/${id}`);
    return data;
  },

  create: async (formData) => {
    const { data } = await api.post('/client-galleries', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return data;
  },

  update: async (id, formData) => {
    const { data } = await api.put(`/client-galleries/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return data;
  },

  delete: async (id) => {
    const { data } = await api.delete(`/client-galleries/${id}`);
    return data;
  },

  addImages: async (id, formData) => {
    const { data } = await api.post(`/client-galleries/${id}/images`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return data;
  },

  deleteImage: async (id, imageId) => {
    const { data } = await api.delete(`/client-galleries/${id}/images/${imageId}`);
    return data;
  }
};
