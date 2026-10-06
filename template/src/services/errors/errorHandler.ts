import axios from 'axios';
import i18n from '@/i18n';
import { FIREBASE_ERROR_MAP } from './firebaseErrorMap';
import { BACKEND_ERROR_MAP } from './backendErrorCodes';
import { HTTP_STATUS_MAP } from './httpStatusMap';
import { ErrorToast } from '../toast';

export type BackendErrorResponse = {
  code?: string;
  error_code?: string;
  message?: string;
  error?: string;
  msg?: string;
  errors?: Record<string, string[]>;
};

function extractBackendMessage(data: any): string | null {
  if (!data) return null;
  if (typeof data === 'string') return data;

  return (
    data.message ||
    data.error ||
    data.msg ||
    (data.errors && Object.values<any>(data.errors)[0]?.[0]) ||
    null
  );
}

function extractBackendCode(data: any): string | null {
  return data?.code || data?.error_code || null; //"code": "EMAIL_ALREADY_EXISTS" OR "error_code": "EMAIL_ALREADY_EXISTS"
}

export function getErrorMessage(error: any): string {
  /* 1️⃣ Firebase Auth */
  if (
    typeof error?.code === 'string' &&
    error.code.startsWith('auth/') &&
    FIREBASE_ERROR_MAP[error.code]
  ) {
    return i18n.t(FIREBASE_ERROR_MAP[error.code] as any);
  }

  /* 2️⃣ Axios backend / network */
  if (axios.isAxiosError(error)) {
    // network error
    if (error.message === 'Network Error') {
      return i18n.t('errors.network');
    }

    const status = error.response?.status;
    const data = error.response?.data;

    // backend business code
    const backendCode = extractBackendCode(data);
    if (backendCode && BACKEND_ERROR_MAP[backendCode]) {
      return i18n.t(BACKEND_ERROR_MAP[backendCode] as any);
    }

    // raw backend message
    const backendMsg = extractBackendMessage(data);
    if (backendMsg) return backendMsg;

    // http status → i18n
    if (status && HTTP_STATUS_MAP[status]) {
      return i18n.t(HTTP_STATUS_MAP[status] as any);
    }
  }

  /* 3️⃣ Fetch style */
  if (error?.status && HTTP_STATUS_MAP[error.status]) {
    return i18n.t(HTTP_STATUS_MAP[error.status] as any);
  }

  /* 4️⃣ JS runtime */
  if (error instanceof Error && error.message) {
    return error.message;
  }

  /* 5️⃣ Final fallback */
  return i18n.t('errors.generic');
}

export function ErrorHandler(error: unknown) {
  if (__DEV__) {
    console.log('[ErrorHandler]', error);
  }

  const message = getErrorMessage(error);

  ErrorToast({
    message,
  });
}
