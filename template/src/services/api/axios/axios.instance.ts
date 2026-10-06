import axios from 'axios';
import { mockAdapter } from '../mock/mockAdapter';

/** No API_BASE_URL in `.env` → every request is answered by the built-in mock backend. */
export const USE_MOCK_API = !process.env.API_BASE_URL;

export const apiClient = axios.create({
  baseURL: process.env.API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  ...(USE_MOCK_API ? { adapter: mockAdapter } : {}),
});
