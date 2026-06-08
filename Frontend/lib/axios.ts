import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios';

// Create axios instance with default config
const axiosInstance: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4100/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add auth token to requests
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Get token from localStorage (if you're storing it there)
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle responses and errors globally
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    // Return only the data part of the response
    return response;
  },
  (error: AxiosError) => {
    // Handle different error scenarios
    if (error.response) {
      // Server responded with error status
      const status = error.response.status;
      
      switch (status) {
        case 401:
          // Unauthorized - clear token and redirect to login
          if (typeof window !== 'undefined') {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
          }
          break;
          
        case 403:
          // Forbidden - user doesn't have permission
          console.error('Access forbidden');
          break;
          
        case 404:
          // Not found
          console.error('Resource not found');
          break;
          
        case 500:
          // Server error
          console.error('Internal server error');
          break;
          
        default:
          console.error('An error occurred:', error.response.data);
      }
    } else if (error.request) {
      // Request was made but no response received
      console.error('No response received from server');
    } else {
      // Something else happened
      console.error('Error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;

// Helper functions for common HTTP methods
export const api = {
  get: <T = any>(url: string, config = {}) => 
    axiosInstance.get<T>(url, config),
    
  post: <T = any>(url: string, data = {}, config = {}) => 
    axiosInstance.post<T>(url, data, config),
    
  put: <T = any>(url: string, data = {}, config = {}) => 
    axiosInstance.put<T>(url, data, config),
    
  patch: <T = any>(url: string, data = {}, config = {}) => 
    axiosInstance.patch<T>(url, data, config),
    
  delete: <T = any>(url: string, config = {}) => 
    axiosInstance.delete<T>(url, config),
};
