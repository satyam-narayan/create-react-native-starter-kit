import { LIMITS } from '@/constants/limits';
import { REGEX } from '@/constants/regex';
import * as yup from 'yup';
import { MSG } from '../messages';

export const profileSetupSchema = yup.object({
  name: yup
    .string()
    .trim()
    .required(MSG.required)
    .min(LIMITS.NAME.min, MSG.min)
    .max(LIMITS.NAME.max, MSG.max)
    .matches(REGEX.HAS_LETTER, MSG.hasLetter),

  phone: yup
    .string()
    .trim()
    .required(MSG.required)
    .test('phone-min', MSG.min, val => {
      if (!val) return false;
      const digits = val.replace(/\D/g, '');
      return digits.length >= LIMITS.PHONE.min;
    })
    .test('phone-max', MSG.max, val => {
      if (!val) return false;
      const digits = val.replace(/\D/g, '');
      return digits.length <= LIMITS.PHONE.max;
    })
    .matches(REGEX.PHONE, MSG.phone),

  gender: yup.string().trim().required(MSG.selectOption),

  address: yup
    .string()
    .trim()
    .required(MSG.required)
    .min(LIMITS.ADDRESS.min, MSG.min)
    .max(LIMITS.ADDRESS.max, MSG.max)
    .matches(REGEX.HAS_LETTER, MSG.hasLetter),

  dob: yup.date().required(MSG.required),

  currentTime: yup.date().required(MSG.required),

  profilePicture: yup.string().nullable().notRequired(),
});
