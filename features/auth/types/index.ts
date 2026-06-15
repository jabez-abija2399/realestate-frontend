import type { User } from '@/types';

/**
 * Auth feature types.
 * User and UserRole are re-exported from @/types — source of truth stays there.
 */

export type { User };

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role: 'buyer' | 'owner';
  walletAddress?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}
