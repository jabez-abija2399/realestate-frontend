import { apiClient } from '@/lib/api/axios-client';
import { endpoints } from '@/lib/api/endpoints';
import { AUTH_COOKIE_NAME } from '@/lib/auth/session';
import { sleep } from '@/lib/utils';
import type { LoginPayload, RegisterPayload, AuthResponse } from '../types';

/**
 * auth.service.ts — all auth API calls.
 *
 * After login/register the JWT is stored as a cookie so proxy.ts can read it
 * on subsequent requests. We do NOT use localStorage (per spec).
 *
 * ── Mock credentials (dev only) ──────────────────────────────────────────────
 *  buyer@test.com  / password123  → role: buyer
 *  owner@test.com  / password123  → role: owner
 *  admin@test.com  / password123  → role: admin
 *
 * Tokens are pre-signed JWTs with exp = year 2099 (never expire in dev).
 * Payload: { sub, role, name, email, iat, exp }
 * ─────────────────────────────────────────────────────────────────────────────
 */

const IS_MOCK = process.env.NODE_ENV === 'development';

// Pre-built JWTs — header.payload.signature (signature is fake, jwt-decode only reads payload)
const MOCK_TOKENS: Record<string, { token: string; user: AuthResponse['user'] }> = {
  'buyer@test.com': {
    // { sub: "user-1", role: "buyer", name: "Test Buyer", email: "buyer@test.com", iat: 1700000000, exp: 4070908800 }
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyLTEiLCJyb2xlIjoiYnV5ZXIiLCJuYW1lIjoiVGVzdCBCdXllciIsImVtYWlsIjoiYnV5ZXJAdGVzdC5jb20iLCJpYXQiOjE3MDAwMDAwMDAsImV4cCI6NDA3MDkwODgwMH0.mock',
    user: { id: 'user-1', name: 'Test Buyer',  email: 'buyer@test.com', role: 'buyer', verified: true,  suspended: false, createdAt: '2025-01-01T00:00:00Z' },
  },
  'owner@test.com': {
    // { sub: "user-2", role: "owner", name: "Test Owner", email: "owner@test.com", iat: 1700000000, exp: 4070908800 }
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyLTIiLCJyb2xlIjoib3duZXIiLCJuYW1lIjoiVGVzdCBPd25lciIsImVtYWlsIjoib3duZXJAdGVzdC5jb20iLCJpYXQiOjE3MDAwMDAwMDAsImV4cCI6NDA3MDkwODgwMH0.mock',
    user: { id: 'user-2', name: 'Test Owner',  email: 'owner@test.com', role: 'owner', verified: true,  suspended: false, createdAt: '2025-01-01T00:00:00Z' },
  },
  'admin@test.com': {
    // { sub: "user-3", role: "admin", name: "Test Admin", email: "admin@test.com", iat: 1700000000, exp: 4070908800 }
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyLTMiLCJyb2xlIjoiYWRtaW4iLCJuYW1lIjoiVGVzdCBBZG1pbiIsImVtYWlsIjoiYWRtaW5AdGVzdC5jb20iLCJpYXQiOjE3MDAwMDAwMDAsImV4cCI6NDA3MDkwODgwMH0.mock',
    user: { id: 'user-3', name: 'Test Admin',  email: 'admin@test.com', role: 'admin', verified: true,  suspended: false, createdAt: '2025-01-01T00:00:00Z' },
  },
};

function setAuthCookie(token: string) {
  const maxAge = 60 * 60 * 24 * 7; // 7 days in seconds
  document.cookie = `${AUTH_COOKIE_NAME}=${token}; path=/; max-age=${maxAge}; SameSite=Lax`;
}

function clearAuthCookie() {
  document.cookie = `${AUTH_COOKIE_NAME}=; path=/; max-age=0; SameSite=Lax`;
}

export const authService = {
  async login(payload: LoginPayload): Promise<AuthResponse> {
    if (IS_MOCK) {
      await sleep(400);
      const mock = MOCK_TOKENS[payload.email.toLowerCase()];
      if (!mock || payload.password !== 'password123') {
        throw new Error('Invalid credentials. Use buyer/owner/admin @test.com with password123');
      }
      setAuthCookie(mock.token);
      return mock;
    }
    const { data } = await apiClient.post<{ data: AuthResponse }>(
      endpoints.auth.login,
      payload
    );
    setAuthCookie(data.data.token);
    return data.data;
  },

  async register(payload: RegisterPayload): Promise<AuthResponse> {
    if (IS_MOCK) {
      await sleep(500);
      // In mock mode, register creates a buyer or owner account
      const role = payload.role ?? 'buyer';
      const email = payload.email.toLowerCase();
      const mockKey = `${role}@test.com`;
      const base = MOCK_TOKENS[mockKey];
      const mockUser: AuthResponse = {
        token: base.token,
        user: { ...base.user, name: payload.name, email, id: `user-new-${Date.now()}` },
      };
      setAuthCookie(mockUser.token);
      return mockUser;
    }
    const { data } = await apiClient.post<{ data: AuthResponse }>(
      endpoints.auth.register,
      payload
    );
    setAuthCookie(data.data.token);
    return data.data;
  },

  async logout(): Promise<void> {
    try {
      await apiClient.post(endpoints.auth.logout);
    } finally {
      // Always clear the cookie, even if the server call fails
      clearAuthCookie();
    }
  },

  async me(): Promise<AuthResponse['user']> {
    const { data } = await apiClient.get<{ data: AuthResponse['user'] }>(
      endpoints.auth.me
    );
    return data.data;
  },
};
