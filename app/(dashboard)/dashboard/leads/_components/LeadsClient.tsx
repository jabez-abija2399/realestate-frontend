'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { LeadFunnel } from '@/components/charts/LeadFunnel';
import { StatCard } from '@/components/ui/StatCard';
import { DataTable } from '@/components/ui/DataTable';
import { type ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/Badge';
import { Search } from 'lucide-react';

interface Lead { id: string; name: string; email: string; listing: string; status: string; date: string; }

const MOCK_LEADS: Lead[] = [
  { id: '1', name: 'Tigist Alemu',   email: 'tigist@example.com', listing: 'Bole Villa',    status: 'active',  date: '2025-11-10' },
  { id: '2', name: 'Dawit Tesfaye',  email: 'dawit@example.com',  listing: 'CMC Studio',    status: 'pending', date: '2025-11-08' },
  { id: '3', name: 'Sara Kebede',    email: 'sara@example.com',   listing: 'Ayat House',    status: 'active',  date: '2025-11-06' },
  { id: '4', name: 'Yonas Girma',    email: 'yonas@example.com',  listing: 'Bole Villa',    status: 'expired', date: '2025-10-28' },
];

const FUNNEL_DATA = [
  { stage: 'Views',     count: 340 },
  { stage: 'Inquiries', count: 82  },
  { stage: 'Viewings',  count: 31  },
  { stage: 'Offers',    count: 12  },
  { stage: 'Closed',    count: 4   },
];

const columns: ColumnDef<Lead>[] = [
  { accessorKey: 'name',    header: 'Name',    cell: ({ getValue }) => <span className="font-medium">{getValue<string>()}</span> },
  { accessorKey: 'email',   header: 'Email',   cell: ({ getValue }) => <span className="text-gray-500 text-xs">{getValue<string>()}</span> },
  { accessorKey: 'listing', header: 'Listing' },
  { accessorKey: 'status',  header: 'Status',  cell: ({ getValue }) => <Badge status={getValue<string>()} /> },
  { accessorKey: 'date',    header: 'Date' },
];

export function LeadsClient() {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Total Inquiries"  value={82}  icon={Search} trend={14.2} />
        <StatCard label="Active Leads"     value={31}                             />
        <StatCard label="Conversion Rate"  value="4.9%"              trend={0.8}  />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Lead Funnel</CardTitle></CardHeader>
          <CardContent>
            <LeadFunnel data={FUNNEL_DATA} height={280} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Recent Inquiries</CardTitle></CardHeader>
          <CardContent>
            <DataTable columns={columns} data={MOCK_LEADS} pageSize={5} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
