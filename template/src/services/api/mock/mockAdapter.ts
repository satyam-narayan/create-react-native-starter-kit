import { AxiosError, type AxiosAdapter, type AxiosResponse } from 'axios';
import { ENDPOINTS } from '@/constants/endpoint';
import type { ApiResponse } from '@/types';
import type { UserProfile } from '../user/user.api';

/**
 * Built-in fake backend used while `API_BASE_URL` is not set in `.env`.
 * Lets screens call the real API functions and hooks on day one.
 * Add a handler here for every new endpoint you want to design against.
 */

const MOCK_DELAY_MS = 600;

let mockProfile: UserProfile = {
  id: 'user_1',
  isProfileSetup: true,
  name: 'Alex Johnson',
  email: 'alex@example.com',
  image_url: null,
};

type MockHandler = (body: unknown) => { message: string; payload: unknown };

/** React Native's FormData exposes its fields through getParts(). */
const readFormData = (body: unknown): Record<string, unknown> => {
  const parts =
    (body as { getParts?: () => Array<Record<string, unknown>> })?.getParts?.() ?? [];
  return parts.reduce<Record<string, unknown>>((acc, part) => {
    const key = part.fieldName as string;
    acc[key] = part.string ?? part.uri;
    return acc;
  }, {});
};

const handlers: Record<string, MockHandler> = {
  [`post ${ENDPOINTS.auth.login}`]: () => ({
    message: 'Logged in',
    payload: { access_token: 'mock-access-token' },
  }),
  [`post ${ENDPOINTS.auth.signup}`]: () => ({
    message: 'Account created',
    payload: { access_token: 'mock-access-token' },
  }),
  [`post ${ENDPOINTS.auth.logout}`]: () => ({
    message: 'Logged out',
    payload: null,
  }),
  [`get ${ENDPOINTS.app.profile}`]: () => ({
    message: 'Profile loaded',
    payload: mockProfile,
  }),
  [`patch ${ENDPOINTS.app.updateProfile}`]: body => {
    mockProfile = { ...mockProfile, ...readFormData(body) };
    return { message: 'Profile updated successfully', payload: mockProfile };
  },
};

const wrap = <T>(message: string, payload: T, result = true): ApiResponse<T> => ({
  result,
  requestId: `mock-${Date.now()}`,
  message,
  messageLBL: message,
  payload,
});

export const mockAdapter: AxiosAdapter = async config => {
  await new Promise<void>(resolve => setTimeout(resolve, MOCK_DELAY_MS));

  const key = `${(config.method ?? 'get').toLowerCase()} ${config.url ?? ''}`;
  const handler = handlers[key];

  if (!handler) {
    const response: AxiosResponse = {
      data: wrap(`No mock for ${key}`, null, false),
      status: 404,
      statusText: 'Not Found',
      headers: {},
      config,
    };
    throw new AxiosError(
      `No mock handler for ${key}. Add one in services/api/mock/mockAdapter.ts`,
      AxiosError.ERR_BAD_REQUEST,
      config,
      undefined,
      response,
    );
  }

  const { message, payload } = handler(config.data);
  return {
    data: wrap(message, payload),
    status: 200,
    statusText: 'OK',
    headers: {},
    config,
  };
};
