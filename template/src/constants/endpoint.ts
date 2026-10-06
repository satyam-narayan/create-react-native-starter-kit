export const ENDPOINTS = {
  auth: {
    login: '/auth/login',
    signup: '/auth/register',
    logout: '/auth/logout',
  },
  app: {
    profile: '/profile',
    updateProfile: '/profile',
  },
} as const;
