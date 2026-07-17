import api from './api';

export const serviceService = {
  getServices: () => api.get('/services'),
  getServiceBySlug: (slug) => api.get(`/services/${slug}`),

  // Admin
  createService: (formData) => api.post('/services', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  updateService: (id, formData) => api.put(`/services/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  deleteService: (id) => api.delete(`/services/${id}`),
};
