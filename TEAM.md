# SwafirRE — Team Onboarding Guide

> Written by Jabez for the team. Read this before touching any code.

---

## What is this project?

A decentralised real estate marketplace. Users can search properties, verify
blockchain ownership, and complete sale/lease transactions via smart contracts.

Three user roles exist:
- **Buyer/Renter** — searches and buys/rents
- **Owner/Agent** — lists properties, manages tenants, mints digital titles
- **Admin** — approves listings, verifies brokers, audits transactions

---

## Tech stack (quick reference)

| What | Library |
|------|---------|
| Framework | Next.js 16, App Router, TypeScript |
| Styles | Tailwind CSS v4 |
| UI primitives | Radix UI (hand-built — no shadcn CLI) |
| Data fetching | TanStack React Query v5 |
| Tables | TanStack React Table v8 |
| Forms | react-hook-form + Zod v4 |
| Global state | Zustand v5 |
| Maps | react-map-gl + MapLibre + MapTiler |
| Charts | Recharts v3 |
| Web3 | wagmi v3 + viem |
| Notifications | react-hot-toast |

---

## How to run it locally

```bash
# 1. Install dependencies
npm install

# 2. Copy env file
cp .env.example .env.local

# 3. Start the dev server
npm run dev

# 4. Open http://localhost:3000
```

### Test login credentials (no backend needed)

| Email | Password | Role |
|-------|----------|------|
| buyer@test.com | password123 | Buyer |
| owner@test.com | password123 | Owner/Agent |
| admin@test.com | password123 | Admin |

---

## Project folder structure

```
app/                    → All pages (Next.js App Router)
  (public)/             → Public pages — no login needed
  (auth)/               → Login and register pages
  (dashboard)/          → Protected pages — login required

components/             → Reusable UI components (no API calls here)
  ui/                   → Generic atoms: Button, Card, Modal, Badge...
  listing/              → Listing-specific: ListingCard, ListingGrid...
  map/                  → MapView, MapSkeleton, DrawControl
  forms/                → ListingFormWizard and its steps
  charts/               → YieldChart, OccupancyChart, LeadFunnel
  transactions/         → TransactionCard, SmartContractSummary
  owner/                → TitleCard, TenantCard, ListingTable...
  admin/                → VettingItem, BrokerVerificationItem, UserRow
  common/               → FavoriteButton, NeighborhoodAnalytics
  layout/               → Navbar, Footer, DashboardSidebar, DashboardTopbar
  providers/            → QueryProvider, WagmiProvider, ToastProvider

features/               → Business logic per domain
  auth/                 → Login/register service, queries, components
  listings/             → Listing API service + React Query hooks
  titles/               → Title/NFT service + hooks
  transactions/         → Transaction service + hooks
  leads/                → Leads service + hooks
  tenants/              → Tenants service + hooks
  yield/                → Yield/analytics service + hooks
  users/                → User management (admin)
  vetting/              → AML vetting (admin)

lib/                    → Shared utilities
  api/                  → Axios client, all API endpoints, response types
  auth/                 → JWT session helpers, permission checks
  query/                → React Query client + cache key factory
  validations/          → Environment variable validation

config/                 → App-wide configuration constants
stores/                 → Zustand global state stores
hooks/                  → Reusable React hooks
types/                  → Shared TypeScript types
```

---

## The most important rule

**Never make API calls inside `components/`.**

All API calls live in `features/<domain>/services/`.
All React Query hooks live in `features/<domain>/queries/`.
Components only receive data as props or call hooks.

---

## Each person's README

See the individual files for your specific responsibilities:

- `ONBOARDING_DEV1.md` — Public pages + Map + SEO
- `ONBOARDING_DEV2.md` — Owner dashboard
- `ONBOARDING_DEV3.md` — Auth + Buyer experience
- `ONBOARDING_DEV4.md` — Admin dashboard
- `ONBOARDING_DEV5.md` — Web3 / Blockchain

---

## Git workflow

```bash
# Always create a branch from main
git checkout -b feature/your-feature-name

# Commit with a clear message
git commit -m "feat(listings): add edit listing page"

# Push and open a PR — Jabez reviews
git push origin feature/your-feature-name
```

Branch naming: `feature/`, `fix/`, `chore/`

---

## Questions?

Ask Jabez before changing anything in:
- `lib/` — shared utilities
- `types/index.ts` — shared types
- `config/permissions.config.ts` — role permissions
- `proxy.ts` — route protection
