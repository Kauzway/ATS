import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { isProduction } from '../utils/validateEnv';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Add request interceptor for adding auth headers
apiClient.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    const apiKey = import.meta.env.VITE_API_KEY;
    
    if (apiKey && config.headers) {
      config.headers['Authorization'] = `Bearer ${apiKey}`;
    }
    
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    // Handle specific error codes
    if (error.response) {
      const { status, data } = error.response;
      
      // Handle authentication errors
      if (status === 401 || status === 403) {
        console.error('Authentication error:', data);
        // You could dispatch an action to redirect to login or show error
      }
      
      // Handle API rate limiting
      if (status === 429) {
        console.error('Rate limit exceeded:', data);
        // You could implement retry logic or backoff strategy
      }
      
      // Handle server errors
      if (status >= 500) {
        console.error('Server error:', data);
        // You could implement retry logic for idempotent requests
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error('Network error:', error.message);
    } else {
      // Something happened in setting up the request
      console.error('Request configuration error:', error.message);
    }
    
    // Log only in development, not in production
    if (!isProduction()) {
      console.error('API Error:', {
        url: error.config?.url,
        method: error.config?.method,
        data: error.config?.data,
        status: error.response?.status,
        response: error.response?.data,
      });
    }
    
    return Promise.reject(error);
  }
);

// Generic GET function with type safety
export const get = async <T>(url: string, params?: Record<string, any>, config?: AxiosRequestConfig): Promise<T> => {
  try {
    const response = await apiClient.get<T>(url, { ...config, params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Generic POST function with type safety
export const post = async <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
  try {
    const response = await apiClient.post<T>(url, data, config);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Generic PUT function with type safety
export const put = async <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
  try {
    const response = await apiClient.put<T>(url, data, config);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Generic DELETE function with type safety
export const del = async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
  try {
    const response = await apiClient.delete<T>(url, config);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default apiClient;