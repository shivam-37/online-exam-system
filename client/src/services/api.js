// services/api.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

console.log('🔧 API URL:', API_URL);

// Create axios instance with optimized CORS settings
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('sage_token');
    console.log(`🚀 ${config.method?.toUpperCase()} ${config.url}`, token ? '(Authenticated)' : '(No Auth)');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Add cache busting for GET requests
    if (config.method?.toLowerCase() === 'get') {
      config.params = {
        ...config.params,
        _t: Date.now()
      };
    }

    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log(`✅ ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    if (error.code === 'ERR_NETWORK') {
      console.error('❌ Network Error - CORS issue or server not running');
      console.error('💡 Make sure:');
      console.error('   1. Backend server is running on port 5000');
      console.error('   2. Backend has CORS enabled for http://localhost:3000');
      console.error('   3. You have the correct API_URL in .env');
    }

    if (error.response) {
      console.error(`❌ ${error.response.status} ${error.config?.url}:`, error.response.data);

      // Handle 401 Unauthorized
      if (error.response.status === 401) {
        localStorage.removeItem('sage_token');
        localStorage.removeItem('sage_user');
        window.location.href = '/login';
      }

      // Handle 403 Forbidden
      if (error.response.status === 403) {
        console.error('❌ 403 Forbidden - You don\'t have permission to access this resource');
      }
    }

    return Promise.reject(error);
  }
);

// ==================== AUTH API ====================
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getMe: () => api.get('/auth/me'),
  updateProfile: (userData) => api.put('/auth/update-profile', userData),
  logout: () => api.post('/auth/logout'),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token, password) => api.put(`/auth/reset-password/${token}`, { password }),
};

// ==================== EXAM API ====================
export const examAPI = {
  createExam: (examData) => api.post('/exams', examData),
  getExams: (params = {}) => api.get('/exams', { params }),
  getExam: (id) => api.get(`/exams/${id}`),
  updateExam: (id, examData) => api.put(`/exams/${id}`, examData),
  deleteExam: (id) => api.delete(`/exams/${id}`),
  startExam: (id) => api.post(`/exams/${id}/start`),
  submitExam: (id, data) => api.post(`/exams/${id}/submit`, data),
  getMyExams: () => api.get('/exams/my-exams'),
};

// ==================== REPORT API ====================
export const reportAPI = {
  getMyReports: (params = {}) => api.get('/reports/my-reports', { params }),
  getReport: (id) => api.get(`/reports/${id}`),
  getAllReports: (params = {}) => api.get('/reports', { params }),
  getExamStats: (examId) => api.get(`/reports/exam/${examId}/stats`),
  generateReport: (examId) => api.post(`/reports/generate/${examId}`),
};

// ==================== USER API ====================
export const userAPI = {
  getUsers: (params = {}) => api.get('/users', { params }),
  getUser: (id) => api.get(`/users/${id}`),
  updateUser: (id, userData) => api.put(`/users/${id}`, userData),
  deleteUser: (id) => api.delete(`/users/${id}`),
  getProfile: () => api.get('/users/profile'),
  updateProfile: (userData) => api.put('/users/profile', userData),
  getUserStats: (id) => api.get(`/users/${id}/stats`),
};

// ==================== SETTINGS API ====================
export const settingsAPI = {
  getSettings: () => api.get('/settings'),
  updateSettings: (settings) => api.put('/settings', settings),
  getUserSettings: () => api.get('/settings/user'),
  updateUserSettings: (settings) => api.put('/settings/user', settings),
};

export default api;