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

// Debug logging
console.log('🔍 API Configuration Debug:');
console.log('- Environment MODE:', import.meta.env.MODE);
console.log('- Detected environment:', environment);
console.log('- VITE_API_URL:', import.meta.env.VITE_API_URL);
console.log('- Final API_BASE_URL:', API_BASE_URL);

export default API_CONFIG; 