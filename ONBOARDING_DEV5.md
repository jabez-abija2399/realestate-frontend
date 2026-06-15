# Dev 5 — Web3 / Blockchain Integration

> Read `TEAM.md` first, then come back here.

---

## Your job in one sentence

Integrate the smart contracts: wallet connection, digital title minting as NFTs,
and escrow-based transaction settlement — all using wagmi v3 + viem.

---

## What's already built for you

```
lib/wagmi-config.ts           ← wagmi config (chains: Polygon Amoy + Sepolia)
components/ui/WalletConnectButton.tsx  ← connect/disconnect UI (already works)
```

The `WalletConnectButton` is already wired into:
- `/login` page
- `/register` page
- `/dashboard/settings` page

---

## Files you need to CREATE

### 1. Contract ABIs

```
lib/contracts/abis/
├── TitleNFT.abi.json             ← ERC-721 for property titles
├── PropertyRegistry.abi.json     ← registry contract
└── Escrow.abi.json               ← escrow for sale/lease transactions
```

### 2. Contract addresses

```typescript
// lib/contracts/addresses.ts

import { env } from '@/lib/validations/env';

export const CONTRACT_ADDRESSES = {
  titleNFT:          env.NEXT_PUBLIC_TITLE_NFT_ADDRESS         as `0x${string}`,
  propertyRegistry:  env.NEXT_PUBLIC_PROPERTY_REGISTRY_ADDRESS as `0x${string}`,
  escrow:            env.NEXT_PUBLIC_ESCROW_CONTRACT_ADDRESS    as `0x${string}`,
} as const;
```

### 3. Title contract service

```typescript
// features/titles/services/titleContract.service.ts
'use client';
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import TitleNFTAbi from '@/lib/contracts/abis/TitleNFT.abi.json';
import { CONTRACT_ADDRESSES } from '@/lib/contracts/addresses';

export function useMintTitleOnChain() {
  const { writeContractAsync, data: txHash, isPending } = useWriteContract();
  const { isLoading: isConfirming } = useWaitForTransactionReceipt({ hash: txHash });

  async function mintTitle(titleId: string, ownerAddress: `0x${string}`) {
    const hash = await writeContractAsync({
      address: CONTRACT_ADDRESSES.titleNFT,
      abi: TitleNFTAbi,
      functionName: 'mint',
      args: [ownerAddress, titleId],
    });
    return hash;
  }

  return { mintTitle, isPending: isPending || isConfirming, txHash };
}
```

### 4. Escrow contract service

```typescript
// features/transactions/services/escrowContract.service.ts
'use client';
import { useWriteContract, useReadContract } from 'wagmi';
import EscrowAbi from '@/lib/contracts/abis/Escrow.abi.json';
import { CONTRACT_ADDRESSES } from '@/lib/contracts/addresses';

export function useCreateEscrow() {
  const { writeContractAsync, isPending } = useWriteContract();

  async function createEscrow(
    propertyId: string,
    sellerAddress: `0x${string}`,
    amountInWei: bigint
  ) {
    return writeContractAsync({
      address: CONTRACT_ADDRESSES.escrow,
      abi: EscrowAbi,
      functionName: 'createEscrow',
      args: [propertyId, sellerAddress],
      value: amountInWei,
    });
  }

  return { createEscrow, isPending };
}

export function useReleaseFunds() {
  const { writeContractAsync, isPending } = useWriteContract();

  async function releaseFunds(escrowId: string) {
    return writeContractAsync({
      address: CONTRACT_ADDRESSES.escrow,
      abi: EscrowAbi,
      functionName: 'release',
      args: [escrowId],
    });
  }

  return { releaseFunds, isPending };
}
```

---

## How to wire your contract hooks into existing UI

### Title minting (coordinate with Dev 2)

In `app/(dashboard)/dashboard/titles/_components/TitlesClient.tsx`, the mint
button currently calls a mock. Replace it:

```typescript
// BEFORE (mock):
function handleMint(titleId: string) {
  toast.promise(new Promise(r => setTimeout(r, 1500)), { ... });
}

// AFTER (your hook):
import { useMintTitleOnChain } from '@/features/titles/services/titleContract.service';

const { mintTitle, isPending } = useMintTitleOnChain();

async function handleMint(titleId: string) {
  const { address } = useAccount(); // from wagmi
  if (!address) { toast.error('Connect your wallet first'); return; }
  await mintTitle(titleId, address);
}
```

### Transaction escrow (coordinate with Dev 3)

The "Make an Offer" button on `/listings/[id]` (Dev 1's page) needs to call
your escrow contract. Dev 1 will add an `onOfferClick` prop — you wire the contract.

---

## Chains configured

```typescript
// lib/wagmi-config.ts
import { polygonAmoy, sepolia } from 'wagmi/chains';

// Current setup: Polygon Amoy (testnet) + Sepolia (testnet)
// Change this when deploying to mainnet
```

### Environment variables you need in `.env.local`

```
NEXT_PUBLIC_CHAIN_ID=11155111                    # Sepolia
NEXT_PUBLIC_RPC_URL=https://sepolia.infura.io/v3/YOUR_KEY
NEXT_PUBLIC_PROPERTY_REGISTRY_ADDRESS=0x...
NEXT_PUBLIC_ESCROW_CONTRACT_ADDRESS=0x...
NEXT_PUBLIC_TITLE_NFT_ADDRESS=0x...
```

---

## Key wagmi v3 patterns

### Read a contract value

```typescript
import { useReadContract } from 'wagmi';

const { data: owner } = useReadContract({
  address: CONTRACT_ADDRESSES.titleNFT,
  abi: TitleNFTAbi,
  functionName: 'ownerOf',
  args: [tokenId],
});
```

### Write to a contract

```typescript
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';

const { writeContractAsync, data: txHash } = useWriteContract();
const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash: txHash });
```

### Get connected wallet

```typescript
import { useAccount, useChainId } from 'wagmi';

const { address, isConnected } = useAccount();
const chainId = useChainId();
```

### Show tx hash after success

Use the existing `HashDisplay` component with the block explorer URL:

```typescript
import { HashDisplay } from '@/components/ui/HashDisplay';
import { appConfig } from '@/config/app.config';

<HashDisplay
  hash={txHash}
  explorerUrl={appConfig.blockchain.txPath(chainId, txHash)}
/>
```

---

## Block explorer URLs (already configured)

```typescript
// config/app.config.ts
appConfig.blockchain.txPath(chainId, txHash)       // transaction URL
appConfig.blockchain.addressPath(chainId, address)  // address URL

// Supported chains:
// 11155111 → https://sepolia.etherscan.io
// 80002    → https://amoy.polygonscan.com
```

---

## Ownership verification on the detail page

`/listings/[id]` (Dev 1's page) already has an on-chain ownership panel that
shows when `listing.titleVerified && listing.tokenId`. Your job is to make
sure the backend returns these fields after minting, and the `HashDisplay`
links to the right explorer.

No code change needed on the detail page — just ensure the API response
includes `tokenId` and `contractAddress` after minting.
