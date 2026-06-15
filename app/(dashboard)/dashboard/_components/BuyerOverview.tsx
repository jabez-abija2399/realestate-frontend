'use client';

import Link from 'next/link';
import { Heart, ArrowRightLeft, Search } from 'lucide-react';
import { StatCard } from '@/components/ui/StatCard';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';

export function BuyerOverview() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">My Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">Track your property searches and transactions.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Saved Properties"   value={7}  icon={Heart}           trend={2} />
        <StatCard label="Active Inquiries"   value={2}  icon={ArrowRightLeft} />
        <StatCard label="Completed Deals"    value={1}  icon={ArrowRightLeft}  trend={0} />
      </div>

      <Card>
        <CardHeader><CardTitle>Quick Actions</CardTitle></CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Button asChild variant="outline">
            <Link href="/listings"><Search size={15} />Search Properties</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/dashboard/favorites"><Heart size={15} />My Favorites</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/dashboard/transactions"><ArrowRightLeft size={15} />My Transactions</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
