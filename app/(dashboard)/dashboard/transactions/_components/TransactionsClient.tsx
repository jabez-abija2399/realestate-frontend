'use client';

import * as React from 'react';
import { type ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/ui/DataTable';
import { Badge } from '@/components/ui/Badge';
import { SmartContractSummary } from '@/components/transactions/SmartContractSummary';
import { EscrowStatusBadge } from '@/components/transactions/EscrowStatusBadge';
import { SkeletonTable } from '@/components/ui/LoadingSkeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { formatCurrency } from '@/lib/utils';
import { ArrowRightLeft } from 'lucide-react';
import type { Transaction } from '@/types';

/* ── Mock data (replaced in Phase 18) ────────────────────────────────────── */
const MOCK: Transaction[] = Array.from({ length: 8 }, (_, i) => ({
  id: `tx-${i + 1}`,
  propertyId: `listing-${i + 1}`,
  propertyTitle: ['Bole Villa', 'Kazanchis Apt', 'CMC Studio', 'Ayat House',
    'Sarbet Office', 'Gerji Condo', 'Piassa Shop', 'Megenagna Penthouse'][i],
  buyerId: 'buyer-1',
  sellerId: 'owner-1',
  type: i % 3 === 0 ? 'lease' : 'sale',
  amount: (i + 1) * 45000 + 20000,
  currency: 'USD',
  status: (['pending','active','completed','active','completed','pending','active','completed'] as const)[i],
  escrowStatus: (['awaiting_funds','funds_held','released','funds_held','released','awaiting_funds','funds_held','released'] as const)[i],
  txHash: i % 2 === 0 ? `0x${Math.random().toString(16).slice(2, 66)}` : undefined,
  date: new Date(Date.now() - i * 86_400_000 * 3).toISOString(),
  updatedAt: new Date(Date.now() - i * 86_400_000).toISOString(),
}));

/* ── Expandable row ────────────────────────────────────────────────────────── */
function ExpandedRow({ tx }: { tx: Transaction }) {
  return (
    <div className="px-4 pb-4">
      <SmartContractSummary transaction={tx} />
    </div>
  );
}

/* ── Main component ─────────────────────────────────────────────────────────── */
export function TransactionsClient() {
  const [expanded, setExpanded] = React.useState<string | null>(null);
  const isLoading = false;

  const columns: ColumnDef<Transaction>[] = [
    {
      accessorKey: 'propertyTitle',
      header: 'Property',
      cell: ({ getValue }) => (
        <span className="font-medium text-gray-900">{getValue<string>()}</span>
      ),
    },
    {
      accessorKey: 'type',
      header: 'Type',
      cell: ({ getValue }) => (
        <Badge
          status={getValue<string>() === 'sale' ? 'active' : 'rented'}
          label={getValue<string>() === 'sale' ? 'Sale' : 'Lease'}
          hideDot
        />
      ),
    },
    {
      accessorKey: 'amount',
      header: 'Amount',
      cell: ({ row }) => (
        <span className="font-semibold">
          {formatCurrency(row.original.amount, row.original.currency)}
        </span>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ getValue }) => <Badge status={getValue<string>()} />,
    },
    {
      accessorKey: 'escrowStatus',
      header: 'Escrow',
      cell: ({ getValue }) => (
        <EscrowStatusBadge status={getValue<Transaction['escrowStatus']>()} />
      ),
    },
    {
      accessorKey: 'date',
      header: 'Date',
      cell: ({ getValue }) =>
        new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' }).format(
          new Date(getValue<string>())
        ),
    },
    {
      id: 'expand',
      header: '',
      cell: ({ row }) => (
        <button
          type="button"
          onClick={() =>
            setExpanded((e) => (e === row.original.id ? null : row.original.id))
          }
          className="text-xs text-emerald-600 hover:text-emerald-700 font-medium"
          aria-expanded={expanded === row.original.id}
        >
          {expanded === row.original.id ? 'Hide' : 'Details'}
        </button>
      ),
    },
  ];

  if (isLoading) return <SkeletonTable rows={6} cols={6} />;

  if (!MOCK.length) {
    return (
      <EmptyState
        title="No transactions yet"
        description="Your transactions will appear here once you start buying or renting."
        icon={ArrowRightLeft}
      />
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Transactions</h1>
        <p className="mt-1 text-sm text-gray-500">All your property transactions and escrow status.</p>
      </div>

      <DataTable columns={columns} data={MOCK} pageSize={10} />

      {/* Expanded row detail */}
      {expanded && (
        <ExpandedRow tx={MOCK.find((t) => t.id === expanded)!} />
      )}
    </div>
  );
}
