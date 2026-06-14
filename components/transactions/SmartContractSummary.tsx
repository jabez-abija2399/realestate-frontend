import * as React from 'react';
import { ExternalLink, ShieldCheck } from 'lucide-react';
import { HashDisplay } from '@/components/ui/HashDisplay';
import { EscrowStatusBadge } from './EscrowStatusBadge';
import { Badge } from '@/components/ui/Badge';
import { appConfig } from '@/config/app.config';
import { cn } from '@/lib/utils';
import type { Transaction } from '@/types';

/**
 * SmartContractSummary — detailed on-chain breakdown for a transaction.
 * Rendered in the expanded row of the /dashboard/transactions DataTable
 * and on the audit page for admins.
 */

interface SmartContractSummaryProps {
  transaction: Transaction;
  className?: string;
}

function InfoRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2.5 border-b border-slate-800 last:border-0">
      <span className="text-xs text-slate-400 shrink-0">{label}</span>
      <div className="flex justify-end">{children}</div>
    </div>
  );
}

export function SmartContractSummary({ transaction: tx, className }: SmartContractSummaryProps) {
  const chainId = Number(process.env.NEXT_PUBLIC_CHAIN_ID ?? 11155111);

  const formattedDate = new Intl.DateTimeFormat('en-US', {
    dateStyle: 'long',
    timeStyle: 'short',
  }).format(new Date(tx.date));

  const formattedUpdated = new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(tx.updatedAt));

  return (
    <div
      className={cn(
        'rounded-xl border border-slate-700 bg-slate-950 p-4 text-sm',
        className
      )}
    >
      {/* Header */}
      <div className="mb-3 flex items-center gap-2">
        <ShieldCheck size={15} className="text-emerald-400" aria-hidden="true" />
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          Smart Contract Details
        </span>
      </div>

      {/* Rows */}
      <div className="flex flex-col">
        <InfoRow label="Transaction ID">
          <span className="font-mono text-xs text-slate-200">{tx.id}</span>
        </InfoRow>

        <InfoRow label="Status">
          <div className="flex gap-2">
            <Badge status={tx.status} />
            <EscrowStatusBadge status={tx.escrowStatus} />
          </div>
        </InfoRow>

        <InfoRow label="Type">
          <span className="text-xs text-slate-200 capitalize">{tx.type}</span>
        </InfoRow>

        <InfoRow label="Amount">
          <span className="text-xs font-semibold text-emerald-400">
            {new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: tx.currency,
              maximumFractionDigits: 0,
            }).format(tx.amount)}
          </span>
        </InfoRow>

        {tx.txHash && (
          <InfoRow label="Tx Hash">
            <HashDisplay
              hash={tx.txHash}
              explorerUrl={appConfig.blockchain.txPath(chainId, tx.txHash)}
              startChars={10}
              endChars={8}
            />
          </InfoRow>
        )}

        {tx.contractAddress && (
          <InfoRow label="Escrow Contract">
            <HashDisplay
              hash={tx.contractAddress}
              explorerUrl={appConfig.blockchain.addressPath(chainId, tx.contractAddress)}
              startChars={10}
              endChars={8}
            />
          </InfoRow>
        )}

        <InfoRow label="Initiated">
          <span className="text-xs text-slate-300">{formattedDate}</span>
        </InfoRow>

        <InfoRow label="Last Updated">
          <span className="text-xs text-slate-300">{formattedUpdated}</span>
        </InfoRow>
      </div>

      {/* Explorer link */}
      {tx.txHash && (
        <a
          href={appConfig.blockchain.txPath(chainId, tx.txHash)}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 transition-colors"
        >
          View on block explorer
          <ExternalLink size={11} />
        </a>
      )}
    </div>
  );
}
