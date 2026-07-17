import api from './api';

export const frameService = {
  getFrames: (params = {}) => api.get('/frames', { params }),
  getFrameBySlug: (slug) => api.get(`/frames/${slug}`),
  trackEvent: (data) => api.post('/frames/track', data),

  // Admin
  createFrame: (data) => api.post('/frames', data),
  updateFrame: (id, data) => api.put(`/frames/${id}`, data),
  deleteFrame: (id) => api.delete(`/frames/${id}`),
};
