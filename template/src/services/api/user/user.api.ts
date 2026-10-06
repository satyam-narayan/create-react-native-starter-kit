import { ApiResponse, ApiSuccess } from '@/types';
import { ENDPOINTS } from '@/constants/endpoint';
import { getCompressedImageForUpload } from '@/utils/imageCompress';
import { apiClient } from '../axios';

export type UserProfile = {
  id: string;
  isProfileSetup: boolean;
  name?: string;
  email?: string;
  image_url?: string | null;
};

/** Text fields are sent as-is; `image_url` is a local file URI that gets compressed and uploaded. */
export type UpdateProfileArgs = {
  image_url?: string;
} & Record<string, string | undefined>;

export const getProfile = async (): Promise<ApiSuccess<UserProfile>> => {
  const res = await apiClient.get<ApiResponse<UserProfile>>(
    ENDPOINTS.app.profile,
  );

  if (!res.data.result) {
    throw new Error(res.data.message || 'Failed to load profile');
  }

  return {
    data: res.data.payload,
    message: res.data.message,
  };
};

export const updateProfile = async (
  args: UpdateProfileArgs,
): Promise<ApiSuccess<UserProfile>> => {
  const formData = new FormData();
  const { image_url, ...fields } = args;

  Object.entries(fields).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      formData.append(key, value);
    }
  });

  if (image_url) {
    const file = await getCompressedImageForUpload(image_url);
    if (file) {
      formData.append('image_url', file as unknown as Blob);
    }
  }

  const res = await apiClient.patch<ApiResponse<UserProfile>>(
    ENDPOINTS.app.updateProfile,
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } },
  );

  if (!res.data.result) {
    throw new Error(res.data.message || 'Failed to update profile');
  }

  return {
    data: res.data.payload,
    message: res.data.message,
  };
};
