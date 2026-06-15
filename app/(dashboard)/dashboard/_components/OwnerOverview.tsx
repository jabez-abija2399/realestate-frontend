'use client';

import Link from 'next/link';
import { Building2, TrendingUp, Users, FileText, Plus } from 'lucide-react';
import { StatCard } from '@/components/ui/StatCard';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { ActivityFeed, type ActivityItem } from '@/components/owner/ActivityFeed';

const MOCK_ACTIVITY: ActivityItem[] = [
  { id: '1', type: 'inquiry_received',      title: 'New inquiry on Bole Villa',        timestamp: new Date(Date.now() - 1_800_000).toISOString() },
  { id: '2', type: 'transaction_started',   title: 'Offer submitted for Kazanchis Apt', timestamp: new Date(Date.now() - 7_200_000).toISOString() },
  { id: '3', type: 'listing_created',       title: 'New listing: CMC Studio',           timestamp: new Date(Date.now() - 86_400_000).toISOString() },
  { id: '4', type: 'title_minted',          title: 'Title minted for Ayat Townhouse',   timestamp: new Date(Date.now() - 172_800_000).toISOString() },
];

export function OwnerOverview() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Owner Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">Manage your listings, titles, and tenants.</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/listings/new"><Plus size={15} />New Listing</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Active Listings"  value={8}    icon={Building2}  trend={1}   />
        <StatCard label="Avg Rental Yield" value="6.4%" icon={TrendingUp} trend={0.3} />
        <StatCard label="Active Tenants"   value={3}    icon={Users}                  />
        <StatCard label="Pending Titles"   value={1}    icon={FileText}               />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle>Quick Actions</CardTitle></CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            <Button asChild variant="outline" size="sm">
              <Link href="/dashboard/listings"><Building2 size={14} />My Listings</Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link href="/dashboard/titles"><FileText size={14} />Digital Titles</Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link href="/dashboard/yield"><TrendingUp size={14} />Rental Yield</Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link href="/dashboard/tenants"><Users size={14} />Tenants</Link>
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
