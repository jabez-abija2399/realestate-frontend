# SwafirRE — Every Page Explained

This document explains every page in the app: what it does, who sees it,
when they land on it, and what the user can do there.

---

## PUBLIC PAGES — No login required

Anyone visiting the website lands here first.

---

### `/` — Home Page

**File:** `app/(public)/page.tsx`

**What it is:**
The landing page. The first thing any visitor sees when they open the website.

**What it shows:**
- A hero section with a headline, description, and two buttons: "Search Properties" and "List Your Property"
- A "Why SwafirRE?" section explaining on-chain ownership, escrow, and vetting
- A grid of featured/premium listings
- A call-to-action section at the bottom to sign up

**When a user lands here:**
- They type the website URL directly
- They click the logo from any other page
- They click "Go home" from an error page

**What they can do:**
- Click "Search Properties" → goes to `/listings`
- Click "List Your Property" → goes to `/register`
- Click any listing card → goes to `/listings/[id]`
- Click "View all" → goes to `/listings`
- Click "Get started" → goes to `/register`

**Who sees it:** Everyone — buyers, owners, admins, guests

---

### `/listings` — Property Search Page

**File:** `app/(public)/listings/page.tsx`

**What it is:**
The main search page. Half map, half property grid. This is where buyers
spend most of their time browsing properties.

**What it shows:**
- Filter bar at the top: search box, listing type (sale/rent), property type, beds, price range, tier
- Left half (desktop): interactive map with property pins
- Right half: scrollable grid of matching property cards
- Result count ("42 properties found")
- Pagination at the bottom of the grid

**When a user lands here:**
- They click "Search Properties" from the home page
- They click "Search" in the navbar
- They share a link like `/listings?listingType=rent&city=Addis+Ababa`
- They click "View all" from the featured listings section

**What they can do:**
- Type in the search box to filter by name/city
- Click filter chips to narrow results
- Click a map pin → a popup appears with property name and price
- Click the popup → goes to the property detail page
- Click a listing card → goes to `/listings/[id]`
- Change page with pagination

**Important technical detail:**
The filters sync with the URL. So if someone searches for 3-bedroom rentals
under $1000, they can copy the URL and share it — the other person sees
the same filtered results.

**Who sees it:** Everyone — no login needed

---

### `/listings/[id]` — Property Detail Page

**File:** `app/(public)/listings/[id]/page.tsx`

**What it is:**
The full detail page for a single property. This is a pre-rendered page
that gets refreshed every hour (ISR) for SEO performance.

**What it shows:**
- Photo gallery with lightbox (click to zoom, arrow navigation)
- Property title, address, status badges
- Price (big, prominent)
- Specs grid: beds, baths, area, parking, year built
- Full description
- Amenities list
- Location map (small, showing just this property's pin)
- Neighbourhood scores (walkability, transit, schools, safety, shopping)
- Right sidebar with:
  - Price + "Make an Offer" or "Apply to Lease" button
  - "Contact Owner" button
  - Owner card (name + verified badge)
  - On-chain ownership panel (dark, shows token ID + contract address)

**When a user lands here:**
- They click a listing card anywhere on the site
- They click a map pin popup
- Google sends them directly (SEO)
- Someone shares the URL

**What they can do:**
- Browse photos (gallery + lightbox)
- Click "Make an Offer" or "Apply to Lease" → initiates a transaction (requires login)
- Click the tx hash → opens the block explorer
- Save to favorites (heart button — requires login)

**SEO features built in:**
- Custom page title per listing (e.g. "3-Bed Villa in Bole | SwafirRE")
- Custom description with price and specs
- Open Graph image = the listing's primary photo
- JSON-LD structured data (Google rich results: price, location, availability)
- Pre-rendered at build time, refreshed every hour

**Who sees it:** Everyone — no login needed

---

### `/about` — About Page

**File:** `app/(public)/about/page.tsx`

**What it is:**
Simple page explaining what SwafirRE is and how it works.

**When a user lands here:** They click "About" in the navbar or footer

**Who sees it:** Everyone

---

### `/contact` — Contact Page

**File:** `app/(public)/contact/page.tsx`

**What it is:**
Contact options — email and Twitter links.

**When a user lands here:** They click "Contact" in the navbar or footer

**Who sees it:** Everyone

---

---

## AUTH PAGES — No login required (but redirect to dashboard if already logged in)

---

### `/login` — Login Page

**File:** `app/(auth)/login/page.tsx`

**What it is:**
The sign-in page. Wrapped in a centred white card with just the logo above it.

**What it shows:**
- "Connect Wallet" button at the top (for Web3 users)
- Email input
- Password input
- "Sign in" button
- Link to `/register`

**When a user lands here:**
- They click "Sign in" in the navbar
- They try to visit a protected page while logged out — the system redirects them here with `?from=/dashboard/listings`
- They click "Sign in" from the register page

**What happens after login:**
- The system stores a JWT token as a cookie called `auth_token`
- The user is redirected to `/dashboard` (or wherever they were trying to go)
- The dashboard shows different content based on their role (buyer/owner/admin)

**Test credentials:**
- `buyer@test.com` / `password123`
- `owner@test.com` / `password123`
- `admin@test.com` / `password123`

**Who sees it:** Logged-out users only

---

### `/register` — Register Page

**File:** `app/(auth)/register/page.tsx`

**What it is:**
New account creation. Same centred card layout as login.

**What it shows:**
- "Connect Wallet" button
- Full name input
- Email input
- Account type dropdown: "Buy or Rent properties" OR "List my properties"
- Password + confirm password
- Terms checkbox
- "Create account" button
- Link to `/login`

**What happens after registration:**
- Same as login — JWT cookie set, redirect to `/dashboard`
- New owners see the owner dashboard, new buyers see the buyer dashboard

**Who sees it:** Logged-out users only

---

---

## DASHBOARD PAGES — Login required

All dashboard pages are protected. If you're not logged in and try to visit one,
you get redirected to `/login?from=<the page you tried to visit>`.

The sidebar shows different links depending on your role:
- **Buyer:** Overview, Transactions, Favorites, Settings
- **Owner:** Overview, My Listings, Digital Titles, Rental Yield, Leads, Tenants, Transactions, Settings
- **Admin:** Everything above plus Users, Roles, Permissions, AML Vetting, Broker Verification, Audit Log, Listing Moderation

---

### `/dashboard` — Overview / Home Dashboard

**File:** `app/(dashboard)/dashboard/page.tsx`

**What it is:**
The first page you see after logging in. Shows a summary relevant to your role.

**Buyer sees:**
- Stats: Saved Properties, Active Inquiries, Completed Deals
- Quick action buttons to Search, Favorites, Transactions

**Owner sees:**
- Stats: Active Listings, Avg Rental Yield, Active Tenants, Pending Titles
- Quick action buttons to all owner pages
- Recent Activity feed (last 4 events: new inquiry, transaction started, etc.)

**Admin sees:**
- Stats: Total Users, Pending Vetting, Broker Queue, Total Transactions
- Quick action buttons to admin pages
- Recent Activity feed

**Who sees it:** Any logged-in user (content changes by role)

---

### `/dashboard/transactions` — Transactions

**File:** `app/(dashboard)/dashboard/transactions/page.tsx`

**What it is:**
A table of all your transactions. Buyers see their purchases/leases. Owners see
transactions on their properties. Admins see all transactions.

**What it shows:**
- Table with columns: Property, Type (Sale/Lease), Amount, Status, Escrow Status, Date
- "Details" link on each row

**What happens when you click Details:**
- Expands a dark panel below the row showing:
  - Transaction ID
  - Full status breakdown
  - On-chain transaction hash (with copy button + block explorer link)
  - Contract address
  - Timestamps

**Who sees it:** All logged-in users (filtered by role)

---

### `/dashboard/settings` — Account Settings

**File:** `app/(dashboard)/dashboard/settings/page.tsx`

**What it is:**
Your account settings page.

**What it shows:**
- Profile form: Full Name, Email, Phone — save button
- Wallet Connection section: connect/disconnect your MetaMask wallet
- Compliance Status: shows KYC, AML, and Broker Licence verification state

**Who sees it:** All logged-in users

---

---

## OWNER-ONLY PAGES

Only visible in the sidebar when logged in with the `owner` role.

---

### `/dashboard/listings` — My Listings Manager

**File:** `app/(dashboard)/dashboard/listings/page.tsx`

**What it is:**
A table of all the properties the owner has listed. Lets them manage their portfolio.

**What it shows:**
- "New Listing" button (top right)
- Table with columns: Property name, Type, Price, Status, Tier
- Per row actions: View (eye icon), Edit (pencil icon), Delete (trash icon)

**What clicking Delete does:**
- Opens a confirmation dialog: "Delete listing? This cannot be undone."
- If confirmed, deletes the listing and refreshes the table

**Who sees it:** Owners only

---

### `/dashboard/listings/new` — Create New Listing

**File:** `app/(dashboard)/dashboard/listings/new/page.tsx`

**What it is:**
A 5-step form wizard to create a new property listing.

**Step 1 — Basic Info:**
Title, description, address, city, country, listing type (sale/rent),
property type (residential/commercial), price, beds, baths, area, year built, coordinates.

**Step 2 — Photos:**
Drag and drop up to 20 photos. The first photo becomes the cover image.

**Step 3 — Amenities:**
Toggle chips for: Wi-Fi, AC, Gym, Pool, Parking, Security, Elevator, etc.

**Step 4 — Tier & Pricing:**
Choose Basic (free), Premium ($29/mo), or Featured ($79/mo).
Rental listings also show: lease duration and security deposit.
Sale listings show: ownership confirmation checkbox.

**Step 5 — Title Documents:**
Upload a scanned copy of the land certificate/deed.
Confirmation checkbox before submitting.

**What happens on submit:**
The listing is submitted for admin review (AML vetting). It won't appear
publicly until an admin approves it.

**Who sees it:** Owners only

---

### `/dashboard/listings/[id]/edit` — Edit Listing

**File:** `app/(dashboard)/dashboard/listings/[id]/edit/page.tsx`

**What it is:**
Same 5-step wizard as "New Listing" but pre-filled with the existing listing's data.

**When a user lands here:**
They click the edit (pencil) icon on a row in `/dashboard/listings`.

**Who sees it:** Owners only (and only for their own listings)

> ⚠️ This page is NOT yet built — Dev 2's first task.

---

### `/dashboard/titles` — Digital Titles

**File:** `app/(dashboard)/dashboard/titles/page.tsx`

**What it is:**
A grid of the owner's property title NFTs. Each card shows whether the title
has been minted on-chain or is still pending admin approval.

**What each card shows:**
- Property name
- Status badge: Minted / Pending / Failed
- If minted: Token ID + Contract address (dark panel)
- "Mint Digital Title" button (only shows for pending titles)
- "View Doc" button if a document was uploaded

**What "Mint Digital Title" does:**
Calls the smart contract to create an NFT on the blockchain that represents
ownership of this property. The owner must have their wallet connected.
This is permanent and on-chain — cannot be undone.

**Who sees it:** Owners only

---

### `/dashboard/yield` — Rental Yield Analytics

**File:** `app/(dashboard)/dashboard/yield/page.tsx`

**What it is:**
Analytics page showing how much rental income each property is generating.

**What it shows:**
- Top stats: Portfolio Avg Yield %, Best Performer %, Avg Occupancy %
- Line chart: monthly yield % per property over time (each property is a different coloured line)
- Horizontal bar chart: occupancy rate per property (green = good, amber = medium, red = low)

**Who sees it:** Owners only

---

### `/dashboard/leads` — Lead Analytics

**File:** `app/(dashboard)/dashboard/leads/page.tsx`

**What it is:**
Shows who has expressed interest in the owner's properties.

**What it shows:**
- Top stats: Total Inquiries, Active Leads, Conversion Rate
- Funnel chart: Views → Inquiries → Viewings → Offers → Closed (shows drop-off at each stage)
- Table of recent inquiries: Name, Email, Which listing, Status, Date

**Who sees it:** Owners only

---

### `/dashboard/tenants` — Tenant Management

**File:** `app/(dashboard)/dashboard/tenants/page.tsx`

**What it is:**
A grid of all current tenants across the owner's rental properties.

**What each card shows:**
- Tenant name + avatar initials
- Which property they're renting
- Email + phone (clickable links)
- Lease start and end dates
- Monthly rent
- Status: Active / Ending Soon / Ended / Pending
- Outstanding balance (shown in red if overdue)

**Who sees it:** Owners only

---

---

## BUYER-ONLY PAGES

---

### `/dashboard/favorites` — Saved Properties

**File:** `app/(dashboard)/dashboard/favorites/page.tsx`

**What it is:**
A grid of listings the buyer has saved by clicking the heart button.

**What it shows:**
- Same listing card grid as the search page
- Empty state if no favorites: "Heart a property on the search page to save it here"

**Who sees it:** Buyers only

> ⚠️ This page is NOT yet built — Dev 3's first task.

---

---

## ADMIN-ONLY PAGES

Only visible in the sidebar when logged in with the `admin` role.

---

### `/dashboard/users` — User Management

**File:** `app/(dashboard)/dashboard/users/page.tsx`

**What it is:**
Full list of all registered users on the platform. Admin can manage them here.

**What it shows:**
- Search bar to filter by name or email
- List of user cards: name, email, role badge, verified/suspended status

**Actions per user (via dropdown menu):**
- Verify identity (shows ✓ badge on the user's profile)
- Change role: set as Buyer, Owner/Agent, or Admin
- Suspend (blocks dashboard access)
- Unsuspend

Each destructive action opens a confirm dialog before proceeding.

**Who sees it:** Admins only

---

### `/dashboard/roles` — Roles

**File:** `app/(dashboard)/dashboard/roles/page.tsx`

**What it is:**
Read-only overview of the three roles: Buyer, Owner/Agent, Admin.
Shows what each role is allowed to do and how many users have that role.

**Who sees it:** Admins only

---

### `/dashboard/permissions` — Permission Matrix

**File:** `app/(dashboard)/dashboard/permissions/page.tsx`

**What it is:**
A full table showing every action in the system and which roles can perform it.
Green checkmark = allowed, grey circle = not allowed.

**Example rows:**
```
listing:create          ✗ Buyer   ✓ Owner   ✓ Admin
listing:update:any      ✗ Buyer   ✗ Owner   ✓ Admin
user:suspend            ✗ Buyer   ✗ Owner   ✓ Admin
audit:read              ✗ Buyer   ✗ Owner   ✓ Admin
```

**Who sees it:** Admins only

---

### `/dashboard/vetting` — AML Vetting Queue

**File:** `app/(dashboard)/dashboard/vetting/page.tsx`

**What it is:**
The compliance review queue. Every new listing and title document must be
approved here before it goes live. This is the AML (Anti-Money Laundering) check.

**What it shows:**
- Amber banner: "7 items awaiting review"
- List of expandable items. Each item shows:
  - Collapsed: property name, owner name, type (Listing or Title), status badge
  - Expanded: submission date, document link, approve/reject buttons

**What Approve does:**
The listing becomes visible to buyers. A toast notification confirms.

**What Reject does:**
Opens a confirmation dialog, then notifies the owner. The listing stays hidden.

**Who sees it:** Admins only

---

### `/dashboard/broker-verification` — Broker Licence Verification

**File:** `app/(dashboard)/dashboard/broker-verification/page.tsx`

**What it is:**
Queue of users who have applied to become licensed brokers/agents.
They upload their broker licence and the admin reviews it here.

**What each item shows (when expanded):**
- Licence number
- Issuing authority
- Expiry date
- Link to view the licence document
- Approve / Reject buttons

**What Approve does:**
The user gains owner-level permissions and can list commercial properties.

**Who sees it:** Admins only

---

### `/dashboard/audit` — Audit Log

**File:** `app/(dashboard)/dashboard/audit/page.tsx`

**What it is:**
A complete, immutable record of every transaction on the platform.
This is the admin's paper trail for regulatory compliance.

**What it shows:**
- Table with: Property, Amount, Type (Sale/Lease), Status, Escrow Status, Tx Hash, Date
- Each transaction hash is displayed as a truncated dark pill with a copy button and link to the block explorer (Etherscan/Polygonscan)

**Who sees it:** Admins only

---

### `/dashboard/listings-moderation` — Listing Moderation

**File:** `app/(dashboard)/dashboard/listings-moderation/page.tsx`

**What it is:**
Admin view of ALL listings on the platform. The admin can flag suspicious
listings, unflag them, or remove them entirely.

**Who sees it:** Admins only

> ⚠️ This page is NOT yet built — Dev 4's first task.

---

---

## SYSTEM PAGES — Automatic, no user action needed

---

### `/unauthorized`

**What it is:**
Shown when a logged-in user tries to visit a page they don't have permission for.
For example, a buyer trying to visit `/dashboard/vetting`.

**Shows:** "Access denied" message with buttons to go to dashboard or home.

---

### `/not-found` (404)

**What it is:**
Shown for any URL that doesn't exist.

**Shows:** "404 Page not found" with buttons to browse listings or go home.

---

### `/sitemap.xml`

**What it is:**
Auto-generated XML file listing all public pages. Google reads this to
discover and index the site. Dashboard pages are excluded.

---

### `/robots.txt`

**What it is:**
Tells search engine crawlers what they can and cannot index.
Dashboard, login, register pages are blocked from indexing.

---

## Quick Reference — Who can access what

| Page | Guest | Buyer | Owner | Admin |
|------|-------|-------|-------|-------|
| `/` | ✓ | ✓ | ✓ | ✓ |
| `/listings` | ✓ | ✓ | ✓ | ✓ |
| `/listings/[id]` | ✓ | ✓ | ✓ | ✓ |
| `/login` | ✓ | ✓ | ✓ | ✓ |
| `/register` | ✓ | ✓ | ✓ | ✓ |
| `/dashboard` | ✗ | ✓ | ✓ | ✓ |
| `/dashboard/transactions` | ✗ | ✓ | ✓ | ✓ |
| `/dashboard/settings` | ✗ | ✓ | ✓ | ✓ |
| `/dashboard/favorites` | ✗ | ✓ | ✗ | ✗ |
| `/dashboard/listings` | ✗ | ✗ | ✓ | ✓ |
| `/dashboard/listings/new` | ✗ | ✗ | ✓ | ✓ |
| `/dashboard/titles` | ✗ | ✗ | ✓ | ✗ |
| `/dashboard/yield` | ✗ | ✗ | ✓ | ✗ |
| `/dashboard/leads` | ✗ | ✗ | ✓ | ✗ |
| `/dashboard/tenants` | ✗ | ✗ | ✓ | ✗ |
| `/dashboard/users` | ✗ | ✗ | ✗ | ✓ |
| `/dashboard/roles` | ✗ | ✗ | ✗ | ✓ |
| `/dashboard/permissions` | ✗ | ✗ | ✗ | ✓ |
| `/dashboard/vetting` | ✗ | ✗ | ✗ | ✓ |
| `/dashboard/broker-verification` | ✗ | ✗ | ✗ | ✓ |
| `/dashboard/audit` | ✗ | ✗ | ✗ | ✓ |
| `/dashboard/listings-moderation` | ✗ | ✗ | ✗ | ✓ |
