import api from './api';

export const collectionService = {
  getAll: async () => {
    const { data } = await api.get('/collections');
    return data;
  },
  
  getBySlug: async (slug) => {
    const { data } = await api.get(`/collections/${slug}`);
    return data;
  },

  // Admin only
  create: async (payload) => {
    const { data } = await api.post('/collections', payload);
    return data;
  },

  update: async (id, payload) => {
    const { data } = await api.put(`/collections/${id}`, payload);
    return data;
  },

  delete: async (id) => {
    const { data } = await api.delete(`/collections/${id}`);
    return data;
  },

  addPhoto: async (id, photoId, order = 0) => {
    const { data } = await api.post(`/collections/${id}/photos`, { photoId, order });
    return data;
  },

  removePhoto: async (id, photoId) => {
    const { data } = await api.delete(`/collections/${id}/photos/${photoId}`);
    return data;
  }
};
