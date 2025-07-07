import { auth } from '../firebase/firebase';
import { API_BASE_URL } from '../config/api';

// Use the proper API configuration that handles environment variables
console.log('🔍 utils/api.ts using API_BASE_URL:', API_BASE_URL);

/**
 * Make an authenticated API call with Firebase token
 */
export const makeAuthenticatedRequest = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> => {
  const user = auth.currentUser;
  
  if (!user) {
    throw new Error('User not authenticated');
  }

  const token = await user.getIdToken();
  
  const headers = {
    'Authorization': `Bearer ${token}`,
    ...options.headers,
  };

  const url = `${API_BASE_URL}${endpoint}`;
  console.log('🔍 Making authenticated request to:', url);

  return fetch(url, {
    ...options,
    headers,
  });
};

/**
 * Make a public API call (no authentication required)
 */
export const makePublicRequest = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> => {
  const url = `${API_BASE_URL}${endpoint}`;
  console.log('🔍 Making public request to:', url);
  
  return fetch(url, options);
};

/**
 * Make an authenticated API call with FormData
 */
export const makeAuthenticatedFormRequest = async (
  endpoint: string,
  formData: FormData
): Promise<Response> => {
  const user = auth.currentUser;
  
  if (!user) {
    throw new Error('User not authenticated');
  }

  const token = await user.getIdToken();
  
  const url = `${API_BASE_URL}${endpoint}`;
  console.log('🔍 Making authenticated form request to:', url);
  
  return fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
  });
};

/**
 * API endpoints
 */
export const API_ENDPOINTS = {
  EVENTS: '/api/events',
  EVENTS_MY: '/api/events/my-events',
  USERS: '/api/users',
  ORGANIZERS: '/api/organizers',
} as const; 