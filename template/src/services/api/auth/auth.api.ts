import { ApiResponse, ApiSuccess } from '@/types';
import { apiClient } from '../axios';
import { AUTH_ENDPOINTS } from './auth.endpoints';
import { LoginArgs, LoginResponse } from './auth.types';

export const loginApi = async (
  data: LoginArgs,
): Promise<ApiSuccess<LoginResponse>> => {
  const res = await apiClient.post<ApiResponse<LoginResponse>>(
    AUTH_ENDPOINTS.LOGIN,
    data,
  );

  if (!res.data.result) {
    throw new Error(res.data.message || 'Login failed');
  }

  return {
    data: res.data.payload,
    message: res.data.message,
  };
};
