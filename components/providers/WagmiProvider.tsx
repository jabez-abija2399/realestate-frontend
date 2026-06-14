'use client';

import * as React from 'react';
import { WagmiProvider as WagmiRootProvider } from 'wagmi';
import { wagmiConfig } from '@/lib/wagmi-config';
import { QueryProvider } from './QueryProvider';

/**
 * WagmiProvider — wraps the app with wagmi v3 WagmiProvider.
 *
 * wagmi v3 requires a QueryClient internally, so it must be nested
 * INSIDE QueryClientProvider. We reuse QueryProvider here rather than
 * creating a second client — one client, shared by both wagmi and
 * our own data-fetching hooks.
 *
 * Hierarchy (inside-out):
 *   WagmiProvider → QueryProvider → QueryClientProvider
 *
 * Note: WagmiProvider must be a Client Component because wagmi uses
 * React context and browser APIs (window.ethereum, etc.).
 */

export function WagmiProvider({ children }: { children: React.ReactNode }) {
  return (
    <WagmiRootProvider config={wagmiConfig}>
      <QueryProvider>
        {children}
      </QueryProvider>
    </WagmiRootProvider>
  );
}
