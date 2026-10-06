import { TFunction } from 'i18next';
import { FieldError } from 'react-hook-form';

type Params = {
  min?: number;
  max?: number;
  field?: string;
};

export const tValError = (t: TFunction, err?: FieldError, params?: Params) => {
  if (!err?.message) return undefined;
  return t(err.message as any, { ...params });
};
