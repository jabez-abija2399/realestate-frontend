# Dev 4 — Admin Dashboard

> Read `TEAM.md` first, then come back here.

---

## Your job in one sentence

Build and maintain the admin control centre: user management, AML vetting queue,
broker licence verification, permission matrix, audit log, and listing moderation.

---

## Pages you own

| URL | File | Status |
|-----|------|--------|
| `/dashboard` (admin view) | `app/(dashboard)/dashboard/_components/AdminOverview.tsx` | ✅ Built |
| `/dashboard/users` | `app/(dashboard)/dashboard/users/page.tsx` | ✅ Built |
| `/dashboard/roles` | `app/(dashboard)/dashboard/roles/page.tsx` | ✅ Built |
| `/dashboard/permissions` | `app/(dashboard)/dashboard/permissions/page.tsx` | ✅ Built |
| `/dashboard/vetting` | `app/(dashboard)/dashboard/vetting/page.tsx` | ✅ Built |
| `/dashboard/broker-verification` | `app/(dashboard)/dashboard/broker-verification/page.tsx` | ✅ Built |
| `/dashboard/audit` | `app/(dashboard)/dashboard/audit/page.tsx` | ✅ Built |
| `/dashboard/listings-moderation` | — | ❌ NOT BUILT — your first task |

---

## Components you own

```
components/admin/
├── VettingItem.tsx                 ← expandable AML queue item with approve/reject
├── BrokerVerificationItem.tsx      ← expandable broker licence item
└── UserRow.tsx                     ← user card with role/suspend/verify actions
```

---

## Feature files you work with

```
features/users/
├── types/index.ts
├── services/users.service.ts      ← getUsers, verifyUser, suspendUser, changeRole
└── queries/users.queries.ts       ← useUsers, useVerifyUser, useSuspendUser, useChangeRole

features/vetting/
├── types/index.ts
├── services/vetting.service.ts    ← getQueue, approve, reject
└── queries/vetting.queries.ts     ← useVettingQueue, useApproveVetting, useRejectVetting
```

---

## Key things to understand

### The permission system

`config/permissions.config.ts` has two levels:

**Level 1 — Route access** (`ROUTE_PERMISSIONS`):
```typescript
// Which URL prefixes each role can visit
admin: [
  '/dashboard',
  '/dashboard/users',
  '/dashboard/vetting',
  // ...
]
```

**Level 2 — Action permissions** (`ACTION_PERMISSIONS`):
```typescript
// What specific things each role can do
admin: [
  'user:read', 'user:suspend', 'user:verify', 'user:change-role',
  'vetting:review', 'broker:verify', 'audit:read',
  // ... plus everything owner and buyer can do
]
```

The Permissions page (`/dashboard/permissions`) reads `ACTION_PERMISSIONS` directly
and renders a matrix table. If you add a new permission, it appears automatically.

### The DataTable component

Most admin pages use the shared `DataTable` component. It handles sorting and
pagination automatically. You just define columns:

```typescript
import { DataTable } from '@/components/ui/DataTable';
import { type ColumnDef } from '@tanstack/react-table';

const columns: ColumnDef<YourType>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ getValue }) => <span className="font-medium">{getValue<string>()}</span>,
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ getValue }) => <Badge status={getValue<string>()} />,
  },
];

<DataTable columns={columns} data={items} pageSize={10} />
```

### The VettingItem pattern

`VettingItem` and `BrokerVerificationItem` both follow the same expandable pattern:
- Collapsed: shows summary row (title, name, status badges)
- Expanded: shows document link, details, and approve/reject buttons
- Uses `ConfirmDialog` before any destructive action

```typescript
<VettingItem
  entry={entry}
  onApprove={(id) => approveVetting(id)}
  onReject={(id, reason) => rejectVetting({ id, reason })}
  isLoading={isApproving || isRejecting}
/>
```

### HashDisplay — showing blockchain hashes

The audit log shows transaction hashes. Use `HashDisplay` for any blockchain address
or tx hash — it truncates, adds a copy button, and links to the block explorer:

```typescript
import { HashDisplay } from '@/components/ui/HashDisplay';

<HashDisplay
  hash={tx.txHash}
  explorerUrl={appConfig.blockchain.txPath(chainId, tx.txHash)}
  startChars={8}
  endChars={6}
/>
```

---

## Your first task — Build Listing Moderation page

```
app/(dashboard)/dashboard/listings-moderation/page.tsx
app/(dashboard)/dashboard/listings-moderation/_components/ModerationClient.tsx
```

The moderation page should:
1. Show all listings (use `useListings()` but call the admin endpoint)
2. Show `flag`, `unflag`, and `remove` actions per listing
3. Flagged listings should show a red `Badge status="flagged"`

**API endpoints are already defined:**
```typescript
// lib/api/endpoints.ts
endpoints.admin.listingModeration.list         // GET all listings
endpoints.admin.listingModeration.flag(id)     // POST flag
endpoints.admin.listingModeration.unflag(id)   // POST unflag
endpoints.admin.listingModeration.remove(id)   // DELETE
```

**The nav link is already in the sidebar** — it shows for `admin` role:
```typescript
// config/dashboard-nav.config.ts — already has:
{ label: 'Listing Moderation', href: '/dashboard/listings-moderation', ... }
```

---

## How to add a new admin action

1. Add the permission to `config/permissions.config.ts`:
```typescript
export type Permission =
  | ... existing permissions ...
  | 'listing:new-action';   // add here

ACTION_PERMISSIONS.admin = [...existing, 'listing:new-action'];
```

2. Add the endpoint to `lib/api/endpoints.ts`:
```typescript
endpoints.admin.listingModeration.newAction = (id: string) => `/admin/listings/${id}/new-action`;
```

3. Add the service method to the relevant service file.

4. Add the mutation hook to the relevant queries file.

5. Wire it up in the UI component.

---

## Connecting real API data

All pages currently use mock data. When the backend is ready, update the Client
components to use React Query hooks:

```typescript
// Before (mock):
const MOCK_QUEUE: VettingEntry[] = [...];

// After (real API):
const { data, isLoading } = useVettingQueue();
const items = data?.items ?? [];
```

The service files are already set up — just remove the `IS_MOCK` block:

```typescript
// features/vetting/services/vetting.service.ts
async getQueue() {
  // DELETE these 2 lines when backend is ready:
  if (IS_MOCK) { await sleep(300); return { items: [], ... }; }

  // This line runs when IS_MOCK is removed:
  const { data } = await apiClient.get(endpoints.admin.vetting.queue);
  return data.data;
}
```
