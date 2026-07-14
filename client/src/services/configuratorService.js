import api from './api';

export const finishService = {
  getAll: async () => {
    const { data } = await api.get('/finishes');
    return data;
  },
  create: async (payload) => {
    const { data } = await api.post('/finishes', payload);
    return data;
  },
  update: async (id, payload) => {
    const { data } = await api.put(`/finishes/${id}`, payload);
    return data;
  },
  delete: async (id) => {
    const { data } = await api.delete(`/finishes/${id}`);
    return data;
  },
};

export const glassService = {
  getAll: async () => {
    const { data } = await api.get('/glass');
    return data;
  },
  create: async (payload) => {
    const { data } = await api.post('/glass', payload);
    return data;
  },
  update: async (id, payload) => {
    const { data } = await api.put(`/glass/${id}`, payload);
    return data;
  },
  delete: async (id) => {
    const { data } = await api.delete(`/glass/${id}`);
    return data;
  },
};

export const mountService = {
  getAll: async () => {
    const { data } = await api.get('/mount');
    return data;
  },
  create: async (payload) => {
    const { data } = await api.post('/mount', payload);
    return data;
  },
  update: async (id, payload) => {
    const { data } = await api.put(`/mount/${id}`, payload);
    return data;
  },
  delete: async (id) => {
    const { data } = await api.delete(`/mount/${id}`);
    return data;
  },
};
