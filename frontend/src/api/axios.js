import axios from 'axios';

const API = axios.create({
  // Use VITE_API_URL if defined, otherwise fall back to origin + /api
  baseURL: import.meta.env.VITE_API_URL || '/api',
});

API.interceptors.request.use((config) => {
  // If request is to an admin endpoint, inject the adminToken. Otherwise inject user token.
  const isTargetingAdmin = config.url.startsWith('/admin') || config.url.includes('/api/admin');
  const tokenKey = isTargetingAdmin ? 'adminToken' : 'token';
  const token = localStorage.getItem(tokenKey);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      const isTargetingAdmin = err.config.url.startsWith('/admin') || err.config.url.includes('/api/admin');
      
      if (isTargetingAdmin) {
        localStorage.removeItem('adminToken');
        if (!window.location.pathname.includes('/admin/login')) {
          window.location.href = '/admin/login';
        }
      } else {
        localStorage.removeItem('token');
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(err);
  }
);

export default API;
