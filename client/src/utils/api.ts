import { auth } from '../firebase/firebase';

// Base URL for API calls - update this port to match your server
const API_BASE_URL = 'http://localhost:5001/api'; // Updated to avoid port 5000 conflict

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

  return fetch(`${API_BASE_URL}${endpoint}`, {
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
  return fetch(`${API_BASE_URL}${endpoint}`, options);
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
  
  return fetch(`${API_BASE_URL}${endpoint}`, {
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
  EVENTS: '/events',
  EVENTS_MY: '/events/my-events',
  USERS: '/users',
  ORGANIZERS: '/organizers',
} as const; 