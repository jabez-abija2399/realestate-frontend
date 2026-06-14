import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * cn — className utility used by every component in this project.
 *
 * Combines two tools:
 *  - clsx: handles conditional / array / object class inputs
 *  - tailwind-merge: resolves conflicting Tailwind utilities so the
 *    last one wins (e.g. p-4 + p-6 → p-6, not "p-4 p-6")
 *
 * Usage:
 *   cn('px-4 py-2', isActive && 'bg-emerald-600', className)
 *   cn(['rounded-xl', 'border'], { 'opacity-50': disabled })
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * formatCurrency — formats a number as a locale currency string.
 *
 * Usage:
 *   formatCurrency(1500000)           → "$1,500,000"
 *   formatCurrency(1500000, 'ETB')    → "ETB 1,500,000"
 */
export function formatCurrency(
  amount: number,
  currency = 'USD',
  locale = 'en-US'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * truncateAddress — shortens a wallet address or tx hash for display.
 * Prefer HashDisplay component for interactive use (copy button etc).
 *
 * Usage:
 *   truncateAddress('0xabc...def') → "0xabc...def"
 */
export function truncateAddress(address: string, start = 6, end = 4): string {
  if (address.length <= start + end + 3) return address;
  return `${address.slice(0, start)}...${address.slice(-end)}`;
}

/**
 * sleep — simple promise-based delay. Useful for mock service delays.
 *
 * Usage:
 *   await sleep(300)
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
