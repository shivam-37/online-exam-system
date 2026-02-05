import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Add this for cookies/sessions
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('sage_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear auth if token is invalid
      localStorage.removeItem('sage_token');
      localStorage.removeItem('sage_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getMe: () => api.get('/auth/me'),
  updateProfile: (userData) => api.put('/auth/update-profile', userData),
  logout: () => api.post('/auth/logout'),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token, password) => api.post('/auth/reset-password', { token, password }),
  googleLogin: () => api.get('/auth/google'),
  githubLogin: () => api.get('/auth/github'),
};

// Exam API
export const examAPI = {
  createExam: (examData) => api.post('/exams', examData),
  getExams: () => api.get('/exams'),
  getExam: (id) => api.get(`/exams/${id}`),
  updateExam: (id, examData) => api.put(`/exams/${id}`, examData),
  deleteExam: (id) => api.delete(`/exams/${id}`),
  startExam: (id) => api.post(`/exams/${id}/start`),
  submitExam: (id, data) => api.post(`/exams/${id}/submit`, data),
  getMyExams: () => api.get('/exams/my-exams'),
};

// Report API
export const reportAPI = {
  getMyReports: () => api.get('/reports/my-reports'),
  getReport: (id) => api.get(`/reports/${id}`),
  getAllReports: () => api.get('/reports'),
  getExamStats: (examId) => api.get(`/reports/exam/${examId}/stats`),
  generateReport: (examId) => api.post(`/reports/generate/${examId}`),
};

// Settings API
export const settingsAPI = {
  getSettings: () => api.get('/settings'),
  updateSettings: (settings) => api.put('/settings', settings),
  getUserSettings: () => api.get('/settings/user'),
  updateUserSettings: (settings) => api.put('/settings/user', settings),
};

// User API
export const userAPI = {
  getUsers: () => api.get('/users'),
  getUser: (id) => api.get(`/users/${id}`),
  updateUser: (id, userData) => api.put(`/users/${id}`, userData),
  deleteUser: (id) => api.delete(`/users/${id}`),
  getProfile: () => api.get('/users/profile'),
  updateProfile: (userData) => api.put('/users/profile', userData),
};

// Default export
export default api;