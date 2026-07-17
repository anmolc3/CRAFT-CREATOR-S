import api from './api';

export const inquiryService = {
  submitInquiry: (formData) => {
    // We use multipart/form-data for uploads
    return api.post('/inquiries', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  // Admin
  getInquiries: (params = {}) => api.get('/inquiries', { params }),
  getInquiryStats: () => api.get('/inquiries/stats'),
  getInquiryById: (id) => api.get(`/inquiries/${id}`),
  updateInquiry: (id, data) => api.put(`/inquiries/${id}`, data),
  deleteInquiry: (id) => api.delete(`/inquiries/${id}`),
};
