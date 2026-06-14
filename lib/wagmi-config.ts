import { http, createConfig } from 'wagmi';
import { polygonAmoy, sepolia } from 'wagmi/chains';
import { injected } from 'wagmi/connectors';

/**
 * Minimal wagmi config — wrap your app with <WagmiProvider config={wagmiConfig}>
 * (inside a <QueryClientProvider>, since wagmi v2 depends on @tanstack/react-query).
 *
 * Swap chains/RPC URLs for whichever testnet your contracts are deployed on.
 */
export const wagmiConfig = createConfig({
  chains: [polygonAmoy, sepolia],
  connectors: [injected()], // MetaMask / browser wallet
  transports: {
    [polygonAmoy.id]: http(),
    [sepolia.id]: http(),
  },
});
