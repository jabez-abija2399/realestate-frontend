# Dev 3 — Auth + Buyer Experience

> Read `TEAM.md` first, then come back here.

---

## Your job in one sentence

Own the entire authentication flow and the buyer-facing dashboard experience:
login, register, wallet connection, saved favorites, and transaction history.

---

## Pages you own

| URL | File | Status |
|-----|------|--------|
| `/login` | `app/(auth)/login/page.tsx` | ✅ Built |
| `/register` | `app/(auth)/register/page.tsx` | ✅ Built |
| `/dashboard` (buyer view) | `app/(dashboard)/dashboard/_components/BuyerOverview.tsx` | ✅ Built |
| `/dashboard/transactions` | `app/(dashboard)/dashboard/transactions/page.tsx` | ✅ Built |
| `/dashboard/settings` | `app/(dashboard)/dashboard/settings/page.tsx` | ✅ Built |
| `/dashboard/favorites` | — | ❌ NOT BUILT — your first task |

---

## Components you own

```
features/auth/components/
├── LoginForm.tsx         ← email/password form + WalletConnectButton
└── RegisterForm.tsx      ← registration form with role selection

components/transactions/
├── EscrowStatusBadge.tsx         ← status pill for escrow state
├── TransactionCard.tsx           ← single transaction card
└── SmartContractSummary.tsx      ← on-chain details panel (dark theme)

components/common/
└── FavoriteButton.tsx            ← heart button on listing cards
```

---

## Feature files you work with

```
features/auth/
├── types/index.ts
├── schemas/index.ts               ← Zod validation for login/register
├── services/auth.service.ts       ← login(), register(), logout(), me()
└── queries/auth.queries.ts        ← useLogin, useRegister, useLogout

features/transactions/
├── types/index.ts
├── services/transactions.service.ts  ← getMine(), create()
└── queries/transactions.queries.ts   ← useMyTransactions, useCreateTransaction
```

---

## Key things to understand

### How authentication works

```
User submits login form
  → LoginForm calls useLogin() mutation
    → authService.login() sends email+password to API
      → API returns { token, user }
        → Token stored as cookie: auth_token
          → proxy.ts reads this cookie on every dashboard request
            → Decodes JWT → extracts role
              → Blocks or allows the route
```

**The JWT cookie is the only auth state.** No localStorage, no React context for auth.

### Reading the current user role (client-side)

```typescript
import { usePermission } from '@/hooks/usePermission';

const { role, can, isAuthenticated } = usePermission();

// Check a permission
if (can('transaction:create')) { ... }

// Check a route
if (can('route:/dashboard/favorites')) { ... }
```

### Reading the current user role (server-side / Server Components)

```typescript
import { headers } from 'next/headers';

const h = await headers();
const role = h.get('x-user-role');  // 'buyer' | 'owner' | 'admin'
const userId = h.get('x-user-id');
```

### Mock credentials (for testing)

```
buyer@test.com / password123   → buyer role
owner@test.com / password123   → owner role
admin@test.com / password123   → admin role
```

### How Zod v4 works in forms

```typescript
// ✅ Correct Zod v4 syntax
z.string({ error: 'This field is required' })
z.enum(['buyer', 'owner'], { error: 'Select an option' })

// ❌ Wrong — Zod v3 syntax, will cause TypeScript errors
z.string({ required_error: 'This field is required' })
```

---

## Your first task — Build the Favorites page

Create these files:

```
app/(dashboard)/dashboard/favorites/page.tsx
app/(dashboard)/dashboard/favorites/_components/FavoritesClient.tsx
```

**The service is already partially there in `lib/api/endpoints.ts`:**
```typescript
endpoints.favorites.list    // GET /favorites
endpoints.favorites.add(id) // POST /favorites/:id
endpoints.favorites.remove(id) // DELETE /favorites/:id
```

**Steps:**
1. Create `features/listings/services/favorites.service.ts`
2. Add hooks to `features/listings/queries/listings.queries.ts`
3. Build `FavoritesClient.tsx` using `ListingGrid`
4. Wire `FavoriteButton.tsx` on listing cards to call the mutation

```typescript
// FavoritesClient.tsx skeleton
'use client';
import { useQuery } from '@tanstack/react-query';
import { ListingGrid } from '@/components/listing/ListingGrid';
import { queryKeys } from '@/lib/query/query-keys';

export function FavoritesClient() {
  const { data, isLoading } = useQuery({
    queryKey: queryKeys.favorites.list(),
    queryFn: () => favoritesService.getFavorites(),
  });

  return (
    <ListingGrid
      listings={data ?? []}
      isLoading={isLoading}
      emptyTitle="No saved properties"
      emptyDescription="Heart a property on the search page to save it here."
    />
  );
}
```

---

## How to wire FavoriteButton on listing cards

`ListingGrid` already accepts a `renderFavorite` prop:

```typescript
// In any page that shows a ListingGrid
<ListingGrid
  listings={listings}
  renderFavorite={(listingId) => (
    <FavoriteButton
      listingId={listingId}
      initialFavorited={favoriteIds.includes(listingId)}
      onToggle={(id, isFav) => isFav ? addFavorite(id) : removeFavorite(id)}
    />
  )}
/>
```

---

## How the transactions table works

`TransactionsClient.tsx` currently uses mock data. When the backend is ready:

```typescript
// Replace MOCK array with:
const { data, isLoading } = useMyTransactions();

// Then use data?.items instead of MOCK
```

The columns, `SmartContractSummary` expand, and badges all stay the same.

---

## Auth infrastructure you also own

These files are critical — ask Jabez before changing them:

```
proxy.ts                        ← route protection (reads JWT cookie)
lib/auth/session.ts             ← JWT decode helpers
lib/auth/permissions.ts         ← canAccess(), getAllowedPaths()
app/(dashboard)/layout.tsx      ← reads x-user-role header from proxy
app/(dashboard)/_components/DashboardShell.tsx  ← sidebar state + sign-out
```

### How sign-out works

```typescript
// DashboardShell.tsx
function handleSignOut() {
  document.cookie = `auth_token=; path=/; max-age=0; SameSite=Lax`;
  router.push('/');
  router.refresh(); // clears Next.js router cache
}
```

### The `?from=` redirect

When an unauthenticated user tries to visit `/dashboard/favorites`, proxy.ts
redirects them to `/login?from=/dashboard/favorites`. After login:

```typescript
// auth.queries.ts — useLogin onSuccess
const params = new URLSearchParams(window.location.search);
const from = params.get('from') ?? '/dashboard';
router.push(from);
```
