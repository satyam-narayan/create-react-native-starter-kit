import { AxiosError } from 'axios';
import { store } from '@/store';
import { isDeviceOnline } from '@/services/network';
import { clearAppSession } from '@/utils/clearAppSession';
import { apiClient } from './axios.instance';

/* ================= REQUEST ================= */

apiClient.interceptors.request.use(
  config => {
    if (!isDeviceOnline()) {
      return Promise.reject(
        new AxiosError('Network Error', AxiosError.ERR_NETWORK, config),
      );
    }

    const token = store.getState().auth?.access_token;

    if (token) {
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  error => Promise.reject(error),
);

/* ================= RESPONSE ================= */

apiClient.interceptors.response.use(
  res => res,
  async error => {
    const status = error.response?.status;
    const token = store.getState().auth?.access_token;

    if (status === 401 && token) {
      await clearAppSession();
    }

    return Promise.reject(error);
  },
);
