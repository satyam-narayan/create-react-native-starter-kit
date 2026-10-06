import { ENDPOINTS } from '@/constants/endpoint';

export const AUTH_ENDPOINTS = {
  LOGIN: ENDPOINTS.auth.login,
  SIGNUP: ENDPOINTS.auth.signup,
  LOGOUT: ENDPOINTS.auth.logout,
} as const;
