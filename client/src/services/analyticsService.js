import api from './api';

export const analyticsService = {
  getDashboardStats: () => api.get('/analytics/dashboard'),
  trackEvent: (event, frameId = null, meta = {}) => {
    return api.post('/analytics/track', { event, frameId, meta }).catch(() => {});
  },
};
