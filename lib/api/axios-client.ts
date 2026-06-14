import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { ApiError } from './response';
import { getClientSession } from '@/lib/auth/session';

/**
 * apiClient — single Axios instance used by every feature service.
 *
 * What it does automatically:
 *  1. Prepends NEXT_PUBLIC_API_URL to every request path.
 *  2. Attaches the JWT as a Bearer token (client-side only).
 *  3. Normalises all non-2xx responses into a typed ApiError so
 *     React Query's onError handler always receives the same shape.
 */
export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15_000,
});

// ─── Request interceptor — attach auth token ──────────────────────────────

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // getClientSession() is safe to call here — runs only in the browser
    // (Axios is never used in Server Components; those use fetch directly).
    const session = getClientSession();
    if (session?.token) {
      config.headers.Authorization = `Bearer ${session.token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response interceptor — normalise errors ─────────────────────────────

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string; errors?: Record<string, string[]> }>) => {
    const status = error.response?.status ?? 0;
    const message =
      error.response?.data?.message ??
      error.message ??
      'An unexpected error occurred.';
    const errors = error.response?.data?.errors;

    return Promise.reject(new ApiError(status, message, errors));
  }
);

/**
 * uploadFile — multipart/form-data helper for photos and title documents.
 * Returns the stored URL string from the backend.
 */
export async function uploadFile(
  endpoint: string,
  file: File,
  fieldName = 'file'
): Promise<{ url: string }> {
  const form = new FormData();
  form.append(fieldName, file);

  const { data } = await apiClient.post<{ data: { url: string } }>(
    endpoint,
    form,
    { headers: { 'Content-Type': 'multipart/form-data' } }
  );

  return data.data;
}
