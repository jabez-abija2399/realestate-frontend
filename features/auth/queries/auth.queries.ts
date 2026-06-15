import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { authService } from '../services/auth.service';
import { queryKeys } from '@/lib/query/query-keys';
import type { LoginPayload, RegisterPayload } from '../types';

/**
 * auth.queries.ts — React Query hooks for auth operations.
 */

// ── Current user ──────────────────────────────────────────────────────────────

export function useCurrentUser() {
  return useQuery({
    queryKey: queryKeys.auth.me,
    queryFn: authService.me,
    // Don't auto-fetch — only called when explicitly needed (e.g. settings page)
    enabled: false,
    retry: false,
  });
}

// ── Login ─────────────────────────────────────────────────────────────────────

export function useLogin() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: LoginPayload) => authService.login(payload),

    onSuccess: (data) => {
      // Cache the user so /dashboard/settings doesn't need a re-fetch
      queryClient.setQueryData(queryKeys.auth.me, data.user);
      toast.success(`Welcome back, ${data.user.name}!`);
      // Redirect to dashboard (or the ?from= destination)
      const params = new URLSearchParams(window.location.search);
      const from = params.get('from') ?? '/dashboard';
      router.push(from);
      router.refresh();
    },

    onError: (error: Error) => {
      toast.error(error.message ?? 'Login failed. Check your credentials.');
    },
  });
}

// ── Register ──────────────────────────────────────────────────────────────────

export function useRegister() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: RegisterPayload) => authService.register(payload),

    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.auth.me, data.user);
      toast.success('Account created! Welcome to SwafirRE.');
      router.push('/dashboard');
      router.refresh();
    },

    onError: (error: Error) => {
      toast.error(error.message ?? 'Registration failed. Please try again.');
    },
  });
}

// ── Logout ────────────────────────────────────────────────────────────────────

export function useLogout() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authService.logout,

    onSuccess: () => {
      // Clear all cached data — the new user (or guest) shouldn't see stale data
      queryClient.clear();
      router.push('/');
      router.refresh();
    },

    onError: () => {
      // Even on error the cookie is cleared in authService.logout
      queryClient.clear();
      router.push('/');
    },
  });
}
