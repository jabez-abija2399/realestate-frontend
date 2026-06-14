import { QueryClient } from '@tanstack/react-query';
import { ApiError } from '@/lib/api/response';

/**
 * makeQueryClient — creates a fresh QueryClient with project-wide defaults.
 *
 * Called once on the server (per request) and once on the client (singleton).
 * Keeping the factory separate from the singleton lets us use it cleanly in
 * both the provider and any server-side prefetch helpers.
 */
export function makeQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Data is considered fresh for 60 seconds — avoids redundant refetches
        // when the user navigates between pages quickly.
        staleTime: 60 * 1000,

        // Show cached data while revalidating in the background.
        // This removes flashes of empty state on re-visits.
        // (replaces the deprecated `keepPreviousData`)
        placeholderData: (prev: unknown) => prev,

        // Retry once on failure. API errors (4xx) shouldn't be retried —
        // the retry function below skips them.
        retry: (failureCount, error) => {
          if (error instanceof ApiError && error.status < 500) return false;
          return failureCount < 1;
        },

        refetchOnWindowFocus: false,
      },

      mutations: {
        // Don't retry mutations — they may have already succeeded on the server.
        retry: false,
      },
    },
  });
}

// ─── Browser singleton ───────────────────────────────────────────────────────
// Only initialised once per browser session. The QueryProvider reads this.

let browserClient: QueryClient | undefined;

export function getBrowserQueryClient(): QueryClient {
  if (typeof window === 'undefined') {
    // Server: always create a new client (no shared state between requests).
    return makeQueryClient();
  }

  // Browser: reuse the same instance so the cache persists across navigations.
  if (!browserClient) {
    browserClient = makeQueryClient();
  }
  return browserClient;
}
