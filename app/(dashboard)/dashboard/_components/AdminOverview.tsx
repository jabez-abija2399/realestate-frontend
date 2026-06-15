'use client';

import Link from 'next/link';
import { Users, AlertTriangle, ClipboardList, ShieldCheck } from 'lucide-react';
import { StatCard } from '@/components/ui/StatCard';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { ActivityFeed, type ActivityItem } from '@/components/owner/ActivityFeed';

const MOCK_ACTIVITY: ActivityItem[] = [
  { id: '1', type: 'listing_created',       title: 'New listing awaiting AML review', timestamp: new Date(Date.now() - 900_000).toISOString() },
  { id: '2', type: 'transaction_completed', title: 'Transaction #TX-891 completed',    timestamp: new Date(Date.now() - 3_600_000).toISOString() },
  { id: '3', type: 'listing_updated',       title: 'Broker licence approved: A. Bekele', timestamp: new Date(Date.now() - 7_200_000).toISOString() },
];

export function AdminOverview() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">Platform overview and compliance queue.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Users"       value={1284} icon={Users}         trend={5.2}  />
        <StatCard label="Pending Vetting"   value={7}    icon={AlertTriangle}              />
        <StatCard label="Broker Queue"      value={3}    icon={ShieldCheck}                />
        <StatCard label="Transactions"      value={892}  icon={ClipboardList} trend={12.1} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle>Admin Actions</CardTitle></CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            <Button asChild variant="outline" size="sm">
              <Link href="/dashboard/vetting"><AlertTriangle size={14} />AML Queue (7)</Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link href="/dashboard/broker-verification"><ShieldCheck size={14} />Broker Queue (3)</Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link href="/dashboard/users"><Users size={14} />Manage Users</Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link href="/dashboard/audit"><ClipboardList size={14} />Audit Log</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Recent Activity</CardTitle></CardHeader>
          <CardContent>
            <ActivityFeed items={MOCK_ACTIVITY} maxItems={4} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
