'use client';

import * as React from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { getBrowserQueryClient } from '@/lib/query/query-client';

/**
 * QueryProvider — wraps the app with TanStack QueryClientProvider.
 *
 * Uses getBrowserQueryClient() which:
 *  - Returns a singleton on the browser (cache persists across navigations)
 *  - Returns a fresh client on the server (no shared state between requests)
 *
 * Must be a Client Component because QueryClientProvider uses context.
 */

export function QueryProvider({ children }: { children: React.ReactNode }) {
  // useState ensures the client is only created once per browser session,
  // even with React's strict-mode double-invocation in development.
  const [client] = React.useState(() => getBrowserQueryClient());

  return (
    <QueryClientProvider client={client}>
      {children}
    </QueryClientProvider>
  );
}
