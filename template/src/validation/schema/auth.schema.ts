import * as yup from 'yup';
import { LIMITS } from '../../constants/limits';
import { REGEX } from '../../constants/regex';
import { MSG } from '../messages';

export const registerSchema = yup.object({
  email: yup
    .string()
    .trim()
    .required(MSG.required)
    .email(MSG.email)
    .min(LIMITS.EMAIL.min, MSG.min)
    .max(LIMITS.EMAIL.max, MSG.max)
    .matches(REGEX.EMAIL, MSG.email),

  password: yup
    .string()
    .trim()
    .required(MSG.required)
    .min(LIMITS.PASSWORD.min, MSG.min)
    .max(LIMITS.PASSWORD.max, MSG.max)
    .matches(REGEX.STRONG_PASSWORD, MSG.strongPassword),
});

export const loginSchema = yup.object({
  email: yup
    .string()
    .trim()
    .required(MSG.required)
    .email(MSG.email)
    .min(LIMITS.EMAIL.min, MSG.min)
    .max(LIMITS.EMAIL.max, MSG.max)
    .matches(REGEX.EMAIL, MSG.email),

  password: yup
    .string()
    .trim()
    .required(MSG.required)
    .min(LIMITS.PASSWORD.min, MSG.min)
    .max(LIMITS.PASSWORD.max, MSG.max)
    .matches(REGEX.STRONG_PASSWORD, MSG.strongPassword),
});

export const forgotPasswordSchema = yup.object({
  email: yup
    .string()
    .trim()
    .required(MSG.required)
    .email(MSG.email)
    .min(LIMITS.EMAIL.min, MSG.min)
    .max(LIMITS.EMAIL.max, MSG.max)
    .matches(REGEX.EMAIL, MSG.email),
});
