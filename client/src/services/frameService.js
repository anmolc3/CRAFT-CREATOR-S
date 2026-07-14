import api from './api';

export const frameService = {
  getAll: async () => {
    const { data } = await api.get('/frames');
    return data;
  },
  create: async (payload) => {
    const { data } = await api.post('/frames', payload);
    return data;
  },
  update: async (id, payload) => {
    const { data } = await api.put(`/frames/${id}`, payload);
    return data;
  },
  delete: async (id) => {
    const { data } = await api.delete(`/frames/${id}`);
    return data;
  },
};

export const sizeService = {
  getAll: async () => {
    const { data } = await api.get('/sizes');
    return data;
  },
  create: async (payload) => {
    const { data } = await api.post('/sizes', payload);
    return data;
  },
  update: async (id, payload) => {
    const { data } = await api.put(`/sizes/${id}`, payload);
    return data;
  },
  delete: async (id) => {
    const { data } = await api.delete(`/sizes/${id}`);
    return data;
  },
};
