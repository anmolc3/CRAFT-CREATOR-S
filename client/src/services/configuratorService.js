import api from './api';

export const configuratorService = {
  getConfigOptions: () => api.get('/configurator'),
  getSizes: () => api.get('/configurator/sizes'),
  getGlassOptions: () => api.get('/configurator/glass'),
  getMountOptions: () => api.get('/configurator/mount'),
  getMaterials: () => api.get('/configurator/materials'),
  getColors: () => api.get('/configurator/colors'),

  // Admin CRUD for sizes
  createSize: (data) => api.post('/configurator/sizes', data),
  updateSize: (id, data) => api.put(`/configurator/sizes/${id}`, data),
  deleteSize: (id) => api.delete(`/configurator/sizes/${id}`),

  // Admin CRUD for glass options
  createGlass: (data) => api.post('/configurator/glass', data),
  updateGlass: (id, data) => api.put(`/configurator/glass/${id}`, data),
  deleteGlass: (id) => api.delete(`/configurator/glass/${id}`),

  // Admin CRUD for mount options
  createMount: (data) => api.post('/configurator/mount', data),
  updateMount: (id, data) => api.put(`/configurator/mount/${id}`, data),
  deleteMount: (id) => api.delete(`/configurator/mount/${id}`),
};
