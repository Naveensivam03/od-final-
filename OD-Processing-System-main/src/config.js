/**
 * API Configuration
 * This file centralizes all API-related configuration
 */

// Get the backend URL from environment variables
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

// Validate the backend URL
if (!BACKEND_URL) {
  console.error('Backend URL is not defined in environment variables. Please set VITE_BACKEND_URL.');
}

// Export the API base URL
export const API_BASE_URL = BACKEND_URL || 'http://localhost:10000';

// Log the API configuration in development mode
if (import.meta.env.DEV) {
  console.log(`API Configuration: Using backend at ${API_BASE_URL}`);
}

// API endpoints
export const API_ENDPOINTS = {
  LOGIN: `${API_BASE_URL}/api/login`,
  REGISTER: `${API_BASE_URL}/api/register`,
  OD_APPLICATIONS: `${API_BASE_URL}/api/od-applications`,
  STUDENT_PROFILE: `${API_BASE_URL}/api/student/profile`,
  TEACHER_MENTEE_REQUESTS: `${API_BASE_URL}/api/teacher/mentee-requests`,
  TEACHER_CLASS_ADVISOR_REQUESTS: `${API_BASE_URL}/api/teacher/class-advisor-requests`,
  TEACHER_APPROVE_REQUEST: `${API_BASE_URL}/api/teacher/approve-request`,
  TEACHER_REJECT_REQUEST: `${API_BASE_URL}/api/teacher/reject-request`,
  USERS: `${API_BASE_URL}/api/users`,
  USER_BY_ID: (id) => `${API_BASE_URL}/api/users/${id}`,
  ADMIN_OD_STATISTICS: `${API_BASE_URL}/api/admin/od-statistics`,
  TEACHER_OD_STATISTICS: `${API_BASE_URL}/api/teacher/od-statistics`,
  CLASS_ADVISOR_APPROVE: `${API_BASE_URL}/api/teacher/class-advisor-approve`,
  CLASS_ADVISOR_REJECT: `${API_BASE_URL}/api/teacher/class-advisor-reject`,
  UPLOAD_OD_FILES: `${API_BASE_URL}/api/upload-od-files`,
  FORGOT_PASSWORD: `${API_BASE_URL}/api/forgot-password`,
  VERIFY_OTP: `${API_BASE_URL}/api/verify-otp`,
  RESET_PASSWORD: `${API_BASE_URL}/api/reset-password`,
  SEND_OTP: `${API_BASE_URL}/api/send-otp`,
};

// Helper function to get auth headers
export const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}; 