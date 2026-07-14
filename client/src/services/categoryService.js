import api from './api';

export const categoryService = {
  getAll: async () => {
    const { data } = await api.get('/categories');
    return data;
  },
  
  getBySlug: async (slug) => {
    const { data } = await api.get(`/categories/${slug}`);
    return data;
  },

  // Admin only
  create: async (payload) => {
    const { data } = await api.post('/categories', payload);
    return data;
  },

  update: async (id, payload) => {
    const { data } = await api.put(`/categories/${id}`, payload);
    return data;
  },

  delete: async (id) => {
    const { data } = await api.delete(`/categories/${id}`);
    return data;
  }
};
