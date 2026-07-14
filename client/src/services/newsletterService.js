import api from './api';

export const newsletterService = {
  subscribe: async (email) => {
    const { data } = await api.post('/newsletter/subscribe', { email });
    return data;
  },

  // Admin only
  getSubscribers: async (page = 1, limit = 50) => {
    const { data } = await api.get('/newsletter', { params: { page, limit } });
    return data;
  },

  deleteSubscriber: async (id) => {
    const { data } = await api.delete(`/newsletter/${id}`);
    return data;
  }
};
