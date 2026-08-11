import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Automatically attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('genesis_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const auth = {
  sendOtp: async (email) => {
    return api.post('/auth/send-otp', { email });
  },
  verifyOtp: async (email, otp) => {
    return api.post('/auth/verify-otp', { email, otp });
  },
  login: async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    if (data.mfaRequired) {
      return data;
    }
    localStorage.setItem('genesis_token', data.token);
    localStorage.setItem('genesis_user', JSON.stringify(data.user));
    return data.user;
  },
  loginMfa: async (userId, code) => {
    const { data } = await api.post('/auth/mfa/login-verify', { userId, code });
    localStorage.setItem('genesis_token', data.token);
    localStorage.setItem('genesis_user', JSON.stringify(data.user));
    return data.user;
  },
  register: async (email, password, full_name, code) => {
    return api.post('/auth/register', { email, password, full_name, code });
  },
  logout: () => {
    localStorage.removeItem('genesis_token');
    localStorage.removeItem('genesis_user');
    window.location.href = '/login';
  },
  getCurrentUser: async () => {
    try {
      const { data } = await api.get('/auth/me');
      // Update local storage just in case it changed
      localStorage.setItem('genesis_user', JSON.stringify(data.user));
      return data.user;
    } catch (err) {
      return null;
    }
  },
  updateProfile: async (profileData) => {
    const { data } = await api.put('/auth/profile', profileData);
    localStorage.setItem('genesis_user', JSON.stringify(data.user));
    return data;
  },
  changePassword: async (newPassword) => {
    return api.put('/auth/update-password', { newPassword });
  },
  setupMfa: async () => {
    const { data } = await api.post('/auth/mfa/enroll');
    return data;
  },
  verifyMfa: async (code) => {
    return api.post('/auth/mfa/verify', { code });
  },
  disableMfa: async () => {
    return api.post('/auth/mfa/disable');
  },
  forgotPassword: async (email) => {
    return api.post('/auth/forgot-password', { email });
  },
  resetPassword: async (email, code, newPassword) => {
    return api.post('/auth/reset-password', { email, code, newPassword });
  }
};

export const interview = {
  saveSession: (sessionData) => api.post('/interview/sessions', sessionData),
  getSessions: () => api.get('/interview/sessions'),
  deleteSession: (id) => api.delete(`/interview/sessions/${id}`),
  generateDescription: (title) => api.post('/interview/generate-description', { title }),
  chat: (payload) => api.post('/interview/chat', payload),
  analyzeSession: (payload) => api.post('/interview/analyze-session', payload),
  analyzeJobDescription: (payload) => api.post('/interview/analyze', payload),
};

export const admin = {
  getUsers: () => api.get('/admin/users'),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  updateUserRole: (id, role) => api.put(`/admin/users/${id}/role`, { role }),
  getStats: () => api.get('/admin/stats'),
  createResource: (resource) => api.post('/admin/resources', resource),
  updateResource: (id, resource) => api.put(`/admin/resources/${id}`, resource),
  deleteResource: (id) => api.delete(`/admin/resources/${id}`),
  purgeResources: () => api.delete('/admin/resources/all/purge'),
  seedResources: () => api.post('/admin/seed-resources'),
  provisionUser: (userData) => api.post('/admin/provision', userData),
  uploadPdf: (formData) => api.post('/admin/upload-pdf', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  getResources: () => api.get('/resources'),
  getCategories: () => api.get('/categories'),
  createCategory: (cat) => api.post('/admin/categories', cat),
  deleteCategory: (id) => api.delete(`/admin/categories/${id}`),
  getCmsContent: () => api.get('/cms/content'),
  updateCmsContent: (section, content) => api.put(`/admin/cms/${section}`, { content }),
  getNotifications: () => api.get('/admin/notifications'),
  markNotificationsRead: () => api.post('/admin/notifications/mark-read'),
  updateSecurityKey: (newKey) => api.put('/admin/security-key', { newKey }),
  getSystemSettings: () => api.get('/admin/system-settings'),
  getPublicSystemSettings: () => api.get('/system-settings'),
  updateSystemSettings: (settings) => api.put('/admin/system-settings', { settings }),
  runRawQuery: (query) => api.post('/admin/raw-query', { query }),
  resetUserMfa: (userId) => api.post('/admin/reset-mfa', { userId }),
  resetUserPassword: (userId, password) => api.post('/admin/reset-password', { userId, password }),
  impersonateUser: (userId) => api.post('/admin/user-impersonate', { userId })
};

export default api;
