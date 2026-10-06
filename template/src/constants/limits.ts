export const LIMITS = {
  EMAIL: { min: 5, max: 255 },
  NAME: { min: 1, max: 100 },
  DESCRIPTION: { min: 1, max: 5000 },
  ADDRESS: { min: 1, max: 255 },
  ZIP_CODE: { max: 20 },
  PASSWORD: { min: 8, max: 16 },
  PHONE: { min: 7, max: 15 },
} as const;
