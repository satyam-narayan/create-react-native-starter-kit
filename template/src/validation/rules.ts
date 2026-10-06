import { REGEX } from '@/constants/regex';
import { MSG } from './messages';
import { LIMITS } from '@/constants/limits';

type Limits = { min?: number; max?: number };

const withLength = (limits?: Limits) => ({
  ...(limits?.min && {
    minLength: { value: limits.min, message: MSG.min },
  }),
  ...(limits?.max && {
    maxLength: { value: limits.max, message: MSG.max },
  }),
});

const base = (limits?: Limits) => ({
  setValueAs: (v: string) => v?.trim(),
  ...withLength(limits),
});

// NOTE:
// This file contains rule-based validation for reference and fallback use.
// If you are not using schema-based validation (Yup), you may use these
// rules directly with FormInput.

export const rules = {
  name: (override?: Limits) => ({
    required: MSG.required,
    pattern: { value: REGEX.HAS_LETTER, message: MSG.hasLetter },
    ...base({ ...LIMITS.NAME, ...override }),
  }),

  email: () => ({
    required: MSG.required,
    pattern: { value: REGEX.EMAIL, message: MSG.email },
    ...base(),
  }),

  password: () => ({
    required: MSG.required,
    pattern: { value: REGEX.STRONG_PASSWORD, message: MSG.strongPassword },
    setValueAs: (v: string) => v?.trim(),
  }),
};
