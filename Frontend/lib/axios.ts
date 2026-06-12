import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios';

// Create axios instance with default config
const axiosInstance: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4100/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const accessToken = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
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
  async (error: AxiosError) => {
    const originalRequest: any = error.config;

    // Handle different error scenarios
    if (error.response) {
      // Server responded with error status
      const status = error.response.status;
      const errorData: any = error.response.data;
      
      // Check if token expired and auto-refresh
      if (status === 401 && errorData?.errorCode === 'TOKEN_EXPIRED' && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          // Get refresh token
          const refreshToken = typeof window !== 'undefined' ? localStorage.getItem('refresh_token') : null;

          if (!refreshToken) {
            // No refresh token, redirect to login
            if (typeof window !== 'undefined') {
              localStorage.removeItem('access_token');
              localStorage.removeItem('refresh_token');
              localStorage.removeItem('user');
              window.location.href = '/login';
            }
            return Promise.reject(error);
          }

          // Call refresh token endpoint
          const response = await axios.post(`${axiosInstance.defaults.baseURL}/auth/refresh-token`, {
            refresh_token: refreshToken,
          });

          if (response.data.s === 1 && response.data.data?.access_token) {
            // Update tokens in localStorage
            localStorage.setItem('access_token', response.data.data.access_token);
            
            // Update the failed request with new token
            originalRequest.headers.Authorization = `Bearer ${response.data.data.access_token}`;
            
            // Retry the original request
            return axiosInstance(originalRequest);
          }
        } catch (refreshError) {
          // Refresh failed, clear storage and redirect to login
          if (typeof window !== 'undefined') {
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            localStorage.removeItem('user');
            window.location.href = '/login';
          }
          return Promise.reject(refreshError);
        }
      }
      
      // Handle other status codes
      if (status === 401 && !originalRequest._retry) {
        // Unauthorized - clear tokens and redirect to login
        if (typeof window !== 'undefined') {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
      } else if (status === 403) {
        // Forbidden - user doesn't have permission
        console.error('Access forbidden');
      } else if (status === 404) {
        // Not found
        console.error('Resource not found');
      } else if (status === 500) {
        // Server error
        console.error('Internal server error');
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
