import api from './api';

export const analyticsService = {
  // Public
  track: async (event, photoId = null, meta = null) => {
    try {
      const { data } = await api.post('/analytics/track', { event, photoId, meta });
      return data;
    } catch (error) {
      console.error('Analytics tracking failed', error);
      // Don't throw for analytics to prevent breaking user flow
      return null;
    }
  },

  // Admin
  getDashboardData: async () => {
    const { data } = await api.get('/analytics');
    return data;
  }
};
