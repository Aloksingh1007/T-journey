import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { toast } from 'sonner';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds
});

/**
 * Request Interceptor
 * Add authentication token to all requests
 */
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor
 * Handle common error scenarios globally
 */
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Handle network errors
    if (!error.response) {
      if (error.code === 'ERR_NETWORK') {
        toast.error('Network error. Please check your connection');
      } else if (error.code === 'ECONNABORTED') {
        toast.error('Request timeout. Please try again');
      }
      return Promise.reject(error);
    }

    const status = error.response.status;
    const errorData = error.response.data as any;

    // Handle authentication errors (401)
    if (status === 401) {
      // Clear all auth data
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Dispatch a custom event to notify AuthContext
      window.dispatchEvent(new Event('auth:logout'));
      
      // Only redirect if not already on login page
      if (!window.location.pathname.includes('/login')) {
        toast.error('Session expired. Please log in again');
        // Small delay to ensure toast is visible
        setTimeout(() => {
          window.location.href = '/login';
        }, 500);
      }
      return Promise.reject(error);
    }

    // Handle authorization errors (403)
    if (status === 403) {
      toast.error('You do not have permission to perform this action');
      return Promise.reject(error);
    }

    // Handle not found errors (404)
    if (status === 404) {
      // Don't show toast for 404s, let the component handle it
      return Promise.reject(error);
    }

    // Handle validation errors (400)
    if (status === 400 && errorData?.error?.code === 'VALIDATION_ERROR') {
      // Don't show toast for validation errors, let the form handle it
      return Promise.reject(error);
    }

    // Handle server errors (500+)
    if (status >= 500) {
      toast.error('Server error. Please try again later');
      return Promise.reject(error);
    }

    // For all other errors, let the component handle it
    return Promise.reject(error);
  }
);

export default api;
