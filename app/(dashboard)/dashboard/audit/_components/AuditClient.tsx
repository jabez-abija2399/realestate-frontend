'use client';

import { type ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/ui/DataTable';
import { Badge } from '@/components/ui/Badge';
import { HashDisplay } from '@/components/ui/HashDisplay';
import { EscrowStatusBadge } from '@/components/transactions/EscrowStatusBadge';
import { appConfig } from '@/config/app.config';
import { formatCurrency } from '@/lib/utils';
import type { Transaction } from '@/types';

const CHAIN_ID = Number(process.env.NEXT_PUBLIC_CHAIN_ID ?? 11155111);

const MOCK: Transaction[] = Array.from({ length: 10 }, (_, i) => ({
  id: `tx-${i + 1}`,
  propertyId: `listing-${i + 1}`,
  propertyTitle: ['Bole Villa','Kazanchis Apt','CMC Studio','Ayat House','Sarbet Office',
    'Gerji Condo','Piassa Shop','Penthouse','Family Home','Studio'][i],
  buyerId: 'buyer-1', sellerId: 'owner-1',
  type: (i % 3 === 0 ? 'lease' : 'sale') as 'sale' | 'lease',
  amount: (i + 1) * 40000 + 15000,
  currency: 'USD',
  status: (['completed','active','pending','completed','active','completed','pending','active','completed','active'] as const)[i],
  escrowStatus: (['released','funds_held','awaiting_funds','released','funds_held','released','awaiting_funds','funds_held','released','funds_held'] as const)[i],
  txHash: `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`,
  date: new Date(Date.now() - i * 5 * 86_400_000).toISOString(),
  updatedAt: new Date(Date.now() - i * 86_400_000).toISOString(),
}));

const columns: ColumnDef<Transaction>[] = [
  {
    accessorKey: 'propertyTitle',
    header: 'Property',
    cell: ({ getValue }) => <span className="font-medium text-gray-900">{getValue<string>()}</span>,
  },
  {
    accessorKey: 'amount',
    header: 'Amount',
    cell: ({ row }) => formatCurrency(row.original.amount, row.original.currency),
  },
  {
    accessorKey: 'type',
    header: 'Type',
    cell: ({ getValue }) => (
      <Badge status={getValue<string>() === 'sale' ? 'active' : 'rented'} label={getValue<string>() === 'sale' ? 'Sale' : 'Lease'} hideDot />
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
    cell: ({ getValue }) => <EscrowStatusBadge status={getValue<Transaction['escrowStatus']>()} />,
  },
  {
    accessorKey: 'txHash',
    header: 'Tx Hash',
    cell: ({ getValue }) => {
      const hash = getValue<string | undefined>();
      if (!hash) return <span className="text-gray-400 text-xs">—</span>;
      return (
        <HashDisplay
          hash={hash}
          explorerUrl={appConfig.blockchain.txPath(CHAIN_ID, hash)}
          startChars={8}
          endChars={6}
        />
      );
    },
  },
  {
    accessorKey: 'date',
    header: 'Date',
    cell: ({ getValue }) =>
      new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' }).format(new Date(getValue<string>())),
  },
];

export function AuditClient() {
  return <DataTable columns={columns} data={MOCK} pageSize={10} />;
}
