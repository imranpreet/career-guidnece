// API Configuration
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://career-guidnece-production-d6a5.up.railway.app/api';

export const API_ENDPOINTS = {
  // Auth
  register: `${API_BASE_URL}/auth/register`,
  login: `${API_BASE_URL}/auth/login`,
  
  // User
  dashboard: `${API_BASE_URL}/user/dashboard`,
  profile: `${API_BASE_URL}/user/profile`,
  changePassword: `${API_BASE_URL}/user/change-password`,
  
  // Newsletter
  notifications: `${API_BASE_URL}/newsletter/notifications`,
  markReadNotifications: `${API_BASE_URL}/newsletter/notifications/mark-read`,
  
  // AI
  aiChat: `${API_BASE_URL}/ai/chat`,
  
  // Quiz
  quiz: `${API_BASE_URL}/quiz`,
  
  // Interview
  interview: `${API_BASE_URL}/interview`,
  
  // Resume
  resume: `${API_BASE_URL}/resume`,
  
  // Reviews
  reviews: `${API_BASE_URL}/reviews`,
};

export default API_ENDPOINTS;
