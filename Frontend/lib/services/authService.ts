import { api } from '../axios';

// Types for authentication
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  s: number;
  m: string;
  data: {
    id: string;
    name: string;
    email: string;
    is_verified: number;
    access_token: string;
    refresh_token: string;
  };
}

export interface GoogleAuthResponse {
  s: number;
  m: string;
  data: {
    id: string;
    name: string;
    email: string;
    is_verified: number;
    access_token: string;
    refresh_token: string;
  };
}

// Helper to extract error message from backend response
const extractErrorMessage = (error: any): string => {
  // Handle your backend format: { s: 0, m: "Error message" }
  if (error.response?.data?.m) {
    return error.response.data.m;
  }
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  if (error.response?.data?.error) {
    return error.response.data.error;
  }
  if (error.message) {
    return error.message;
  }
  return 'An unexpected error occurred';
};

// Authentication service functions
export const authService = {
  // Login with email and password
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      const response = await api.post<AuthResponse>('/auth/login', credentials);
      
      // Store tokens and user in localStorage (match backend response format)
      if (response.data.data?.access_token) {
        localStorage.setItem('access_token', response.data.data.access_token);
        localStorage.setItem('refresh_token', response.data.data.refresh_token);
        localStorage.setItem('user', JSON.stringify({
          id: response.data.data.id,
          name: response.data.data.name,
          email: response.data.data.email,
        }));
      }
      
      return response.data;
    } catch (error) {
      throw new Error(extractErrorMessage(error));
    }
  },

  // Signup new user
  signup: async (userData: SignupData): Promise<AuthResponse> => {
    try {
      const response = await api.post<AuthResponse>('/auth/signup', userData);
      
      // Store tokens and user in localStorage if verification not required
      if (response.data.data?.access_token) {
        localStorage.setItem('access_token', response.data.data.access_token);
        localStorage.setItem('refresh_token', response.data.data.refresh_token);
        localStorage.setItem('user', JSON.stringify({
          id: response.data.data.id,
          name: response.data.data.name,
          email: response.data.data.email,
        }));
      }
      
      return response.data;
    } catch (error) {
      throw new Error(extractErrorMessage(error));
    }
  },

  // Logout user
  logout: async (): Promise<void> => {
    try {
      await api.post('/auth/logout');
    } finally {
      // Clear local storage regardless of API response
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
    }
  },

  // Google OAuth login
  googleAuth: async (googleToken: string): Promise<GoogleAuthResponse> => {
    const response = await api.post<GoogleAuthResponse>('/auth/google', {
      token: googleToken,
    });
    
    // Store tokens and user in localStorage
    if (response.data.data?.access_token) {
      localStorage.setItem('access_token', response.data.data.access_token);
      localStorage.setItem('refresh_token', response.data.data.refresh_token);
      localStorage.setItem('user', JSON.stringify({
        id: response.data.data.id,
        name: response.data.data.name,
        email: response.data.data.email,
      }));
    }
    
    return response.data;
  },

  // Get current user from localStorage
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  // Get access token from localStorage
  getToken: () => {
    return localStorage.getItem('access_token');
  },

  // Get refresh token from localStorage
  getRefreshToken: () => {
    return localStorage.getItem('refresh_token');
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('access_token');
  },

  // Verify token with backend (optional)
  verifyToken: async (): Promise<boolean> => {
    try {
      await api.get('/auth/verify');
      return true;
    } catch (error) {
      return false;
    }
  },

  // Verify OTP
  verifyOTP: async (email: string, otp: string): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/verify-email', {
      email,
      otp,
    });
     
    if (response.data.data?.access_token) {
      localStorage.setItem('access_token', response.data.data.access_token);
      localStorage.setItem('refresh_token', response.data.data.refresh_token);
      localStorage.setItem('user', JSON.stringify({
        id: response.data.data.id,
        name: response.data.data.name,
        email: response.data.data.email,
      }));
    }
    
    return response.data;
  },

  // Resend OTP
  resendOTP: async (email: string): Promise<void> => {
    await api.post('/auth/resend-otp-email', { email });

  },
};
