'use client';

import * as React from 'react';
import { Menu, Bell } from 'lucide-react';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

/**
 * DashboardTopbar — mobile header + desktop breadcrumb bar for the dashboard.
 * The hamburger button toggles the mobile sidebar via `onMenuClick`.
 */

interface DashboardTopbarProps {
  user: { name: string; avatarUrl?: string };
  pageTitle?: string;
  onMenuClick: () => void;
  className?: string;
}

export function DashboardTopbar({
  user,
  pageTitle,
  onMenuClick,
  className,
}: DashboardTopbarProps) {
  return (
    <header
      className={cn(
        'flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3 sm:px-6',
        className
      )}
    >
      {/* Left — hamburger + page title */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="rounded-md p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 lg:hidden"
          aria-label="Open sidebar"
        >
          <Menu size={20} />
        </button>
        {pageTitle && (
          <h1 className="text-sm font-semibold text-gray-900 sm:text-base">
            {pageTitle}
          </h1>
        )}
      </div>

      {/* Right — notifications + avatar */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          aria-label="Notifications"
          className="text-gray-400 hover:text-gray-600"
        >
          <Bell size={18} />
        </Button>
        <Avatar src={user.avatarUrl} name={user.name} size="sm" />
      </div>
    </header>
  );
}
