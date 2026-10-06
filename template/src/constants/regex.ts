export const REGEX = {
  HAS_LETTER: /[a-zA-Z]/,
  ZIP_CODE: /^[A-Za-z0-9\s]+$/,
  PHONE: /^[\d\s+]+$/,
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  STRONG_PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/,
};
