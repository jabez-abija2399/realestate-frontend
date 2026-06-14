import * as React from 'react';
import { ArrowRightLeft, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { HashDisplay } from '@/components/ui/HashDisplay';
import { EscrowStatusBadge } from './EscrowStatusBadge';
import { cn, formatCurrency } from '@/lib/utils';
import { appConfig } from '@/config/app.config';
import type { Transaction } from '@/types';

/**
 * TransactionCard — summary card for a single transaction.
 * Used in the expanded row of the transactions DataTable.
 */

interface TransactionCardProps {
  transaction: Transaction;
  className?: string;
}

export function TransactionCard({ transaction: tx, className }: TransactionCardProps) {
  const chainId = Number(process.env.NEXT_PUBLIC_CHAIN_ID ?? 11155111);

  const explorerUrl = tx.txHash
    ? appConfig.blockchain.txPath(chainId, tx.txHash)
    : undefined;

  const formattedDate = new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
  }).format(new Date(tx.date));

  return (
    <div className={cn('rounded-xl border border-gray-200 bg-white p-5', className)}>
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 rounded-lg bg-emerald-50 p-2 text-emerald-600">
            <ArrowRightLeft size={16} aria-hidden="true" />
          </div>
          <div>
            <p className="font-semibold text-gray-900 leading-tight">
              {tx.propertyTitle}
            </p>
            <div className="mt-1 flex items-center gap-1.5 text-xs text-gray-400">
              <Calendar size={11} />
              <span>{formattedDate}</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1.5">
          <p className="text-lg font-bold text-gray-900">
            {formatCurrency(tx.amount, tx.currency)}
          </p>
          <Badge
            status={tx.type === 'sale' ? 'active' : 'rented'}
            label={tx.type === 'sale' ? 'Sale' : 'Lease'}
            hideDot
          />
        </div>
      </div>

      {/* Status row */}
      <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-gray-100 pt-4">
        <Badge status={tx.status} />
        <EscrowStatusBadge status={tx.escrowStatus} />
      </div>

      {/* On-chain data */}
      {(tx.txHash || tx.contractAddress) && (
        <div className="mt-3 flex flex-col gap-2 rounded-lg bg-slate-950 p-3">
          {tx.txHash && (
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs text-slate-400">Tx Hash</span>
              <HashDisplay
                hash={tx.txHash}
                explorerUrl={explorerUrl}
                startChars={8}
                endChars={6}
              />
            </div>
          )}
          {tx.contractAddress && (
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs text-slate-400">Contract</span>
              <HashDisplay
                hash={tx.contractAddress}
                explorerUrl={appConfig.blockchain.addressPath(chainId, tx.contractAddress)}
                startChars={8}
                endChars={6}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
