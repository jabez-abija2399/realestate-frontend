export type { User, UserRole } from '@/types';

export interface UpdateUserPayload {
  name?: string;
  email?: string;
  role?: import('@/types').UserRole;
  verified?: boolean;
  suspended?: boolean;
}
