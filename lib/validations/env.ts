import { z } from 'zod';

/**
 * env.ts — validates all NEXT_PUBLIC_* environment variables at startup.
 *
 * If a required variable is missing the app throws immediately with a clear
 * message instead of failing silently at runtime with a cryptic undefined error.
 *
 * Usage: import { env } from '@/lib/validations/env'
 *        env.NEXT_PUBLIC_API_URL
 */

const envSchema = z.object({
  NEXT_PUBLIC_APP_NAME: z.string().min(1).default('SwafirRE'),
  NEXT_PUBLIC_APP_URL: z.string().url().default('http://localhost:3000'),
  NEXT_PUBLIC_API_URL: z.string().url().default('http://localhost:8000/api/v1'),
  NEXT_PUBLIC_MAPTILER_API_KEY: z.string().default(''),
  NEXT_PUBLIC_CHAIN_ID: z.string().default('11155111'),
  NEXT_PUBLIC_RPC_URL: z.string().default(''),
  NEXT_PUBLIC_PROPERTY_REGISTRY_ADDRESS: z.string().default(''),
  NEXT_PUBLIC_ESCROW_CONTRACT_ADDRESS: z.string().default(''),
  NEXT_PUBLIC_TITLE_NFT_ADDRESS: z.string().default(''),
});

// z.parse throws if required fields are missing — caught at module load time.
const parsed = envSchema.safeParse({
  NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  NEXT_PUBLIC_MAPTILER_API_KEY: process.env.NEXT_PUBLIC_MAPTILER_API_KEY,
  NEXT_PUBLIC_CHAIN_ID: process.env.NEXT_PUBLIC_CHAIN_ID,
  NEXT_PUBLIC_RPC_URL: process.env.NEXT_PUBLIC_RPC_URL,
  NEXT_PUBLIC_PROPERTY_REGISTRY_ADDRESS:
    process.env.NEXT_PUBLIC_PROPERTY_REGISTRY_ADDRESS,
  NEXT_PUBLIC_ESCROW_CONTRACT_ADDRESS:
    process.env.NEXT_PUBLIC_ESCROW_CONTRACT_ADDRESS,
  NEXT_PUBLIC_TITLE_NFT_ADDRESS: process.env.NEXT_PUBLIC_TITLE_NFT_ADDRESS,
});

if (!parsed.success) {
  console.error(
    '❌ Invalid environment variables:\n',
    parsed.error.flatten().fieldErrors
  );
  throw new Error('Missing or invalid environment variables. Check .env.local.');
}

export const env = parsed.data;
