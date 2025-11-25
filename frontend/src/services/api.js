import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getProfile: () => api.get('/auth/me')
};

// Budget API
export const budgetAPI = {
  getBudget: () => api.get('/budget'),
  initializeBudget: (data) => api.post('/budget/initialize', data),
  updateBudget: (data) => api.put('/budget/update', data)
};

// Transaction API
export const transactionAPI = {
  getAllTransactions: () => api.get('/transactions'),
  getTodayExpenses: () => api.get('/transactions/today'),
  createTransaction: (data) => api.post('/transactions', data),
  updateTransaction: (id, data) => api.put(`/transactions/${id}`, data),
  deleteTransaction: (id) => api.delete(`/transactions/${id}`)
};

// Wishlist API
export const wishlistAPI = {
  getAllWishlist: () => api.get('/wishlist'),
  createWishlist: (formData) => api.post('/wishlist', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  updateWishlist: (id, formData) => api.put(`/wishlist/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  deleteWishlist: (id) => api.delete(`/wishlist/${id}`)
};

export default api;
