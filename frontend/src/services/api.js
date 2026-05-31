import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:10000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const authorAPI = {
  getAll: (page = 0, size = 3) => api.get(`/authors?page=${page}&size=${size}`),
  create: (data) => api.post('/authors', data),
  update: (id, data) => api.put(`/authors/${id}`, data),
  delete: (id) => api.delete(`/authors/${id}`),
};

export const bookAPI = {
  getAll: (page = 0, size = 3) => api.get(`/books?page=${page}&size=${size}`),
  create: (data) => api.post('/books', data),
  update: (id, data) => api.put(`/books/${id}`, data),
  delete: (id) => api.delete(`/books/${id}`),
};

export const reviewAPI = {
  getAll: (page = 0, size = 3) => api.get(`/reviews?page=${page}&size=${size}`),
  create: (data) => api.post('/reviews', data),
  update: (id, data) => api.put(`/reviews/${id}`, data),
  delete: (id) => api.delete(`/reviews/${id}`),
};