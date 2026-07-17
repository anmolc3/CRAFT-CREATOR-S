import api from './api';

export const newsletterService = {
  subscribe: (email) => api.post('/newsletter', { email }),
  getSubscribers: (params = {}) => api.get('/newsletter', { params }),
  deleteSubscriber: (id) => api.delete(`/newsletter/${id}`),
};
