// API Configuration
const API_CONFIG = {
  development: {
    baseURL: 'http://localhost:5100'
  },
  production: {
    baseURL: import.meta.env.VITE_API_URL || 'https://calenDUB-backend.onrender.com'
  }
};

const environment = import.meta.env.MODE || 'development';
export const API_BASE_URL = API_CONFIG[environment as keyof typeof API_CONFIG].baseURL;

// API endpoints
export const API_ENDPOINTS = {
  EVENTS: '/api/events',
  USERS: '/api/users',
  ORGANIZERS: '/api/organizers',
  HEALTH: '/api/health'
};

// Helper function to create full API URLs
export const createApiUrl = (endpoint: string) => {
  return `${API_BASE_URL}${endpoint}`;
};

export default API_CONFIG; 