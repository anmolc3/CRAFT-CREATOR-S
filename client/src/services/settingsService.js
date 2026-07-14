import api from './api';

export const settingsService = {
  get: async () => {
    const { data } = await api.get('/settings');
    return data;
  },

  update: async (settingsData) => {
    const { data } = await api.put('/settings', settingsData);
    return data;
  }
};
