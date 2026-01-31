import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    // Get token from cookie
    const tokenCookie = document.cookie
      .split('; ')
      .find(row => row.startsWith('token='));
    
    if (tokenCookie) {
      const token = tokenCookie.split('=')[1];
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        // Clear auth cookies
        document.cookie = 'user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=lax;';
        document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=lax;';
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);
