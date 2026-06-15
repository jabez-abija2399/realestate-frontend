# Dev 2 — Owner Dashboard

> Read `TEAM.md` first, then come back here.

---

## Your job in one sentence

Build the full owner experience: listing creation wizard, digital title minting,
rental yield analytics, lead tracking, and tenant management.

---

## Pages you own

| URL | File | Status |
|-----|------|--------|
| `/dashboard/listings` | `app/(dashboard)/dashboard/listings/page.tsx` | ✅ Built |
| `/dashboard/listings/new` | `app/(dashboard)/dashboard/listings/new/page.tsx` | ✅ Built |
| `/dashboard/listings/[id]/edit` | — | ❌ NOT BUILT — your first task |
| `/dashboard/titles` | `app/(dashboard)/dashboard/titles/page.tsx` | ✅ Built |
| `/dashboard/yield` | `app/(dashboard)/dashboard/yield/page.tsx` | ✅ Built |
| `/dashboard/leads` | `app/(dashboard)/dashboard/leads/page.tsx` | ✅ Built |
| `/dashboard/tenants` | `app/(dashboard)/dashboard/tenants/page.tsx` | ✅ Built |

All these pages are inside `app/(dashboard)/` which requires login.
The sidebar already shows these links only when the user has the `owner` role.

---

## Components you own

```
components/owner/
├── ActivityFeed.tsx        ← recent events timeline
├── ComplianceStatus.tsx    ← KYC/AML status indicators
├── ListingTable.tsx        ← listings data table with edit/delete actions
├── TitleCard.tsx           ← NFT title card with mint button
└── TenantCard.tsx          ← tenant summary card

components/forms/           ← THE LISTING CREATION WIZARD
├── styles.ts               ← shared input CSS classes
├── schemas.ts              ← Zod validation for all 5 steps
├── BasicInfoStep.tsx       ← Step 1: title, address, price, specs
├── AmenitiesStep.tsx       ← Step 2: amenity checkboxes
├── TierSelectionStep.tsx   ← Step 3: basic/premium/featured tier
├── TitleUploadStep.tsx     ← Step 4: document upload + confirmation
└── ListingFormWizard.tsx   ← orchestrates all steps

components/listing/
└── PhotoGallery.tsx        ← PhotoUploadGallery (upload mode)

components/charts/
├── YieldChart.tsx          ← line chart: monthly yield %
├── OccupancyChart.tsx      ← horizontal bar: occupancy per property
└── LeadFunnel.tsx          ← funnel: views → inquiries → offers → closed
```

---

## Feature files you work with

```
features/listings/
├── services/listings.service.ts   ← createListing, updateListing, deleteListing
└── queries/listings.queries.ts    ← useDeleteListing, useUpdateListing

features/titles/
├── services/titles.service.ts     ← getTitles, uploadTitleDocument
└── queries/titles.queries.ts      ← useTitles, useMintTitle

features/leads/
├── services/leads.service.ts
└── queries/leads.queries.ts

features/tenants/
├── services/tenants.service.ts
└── queries/tenants.queries.ts

features/yield/
├── services/yield.service.ts
└── queries/yield.queries.ts
```

---

## Key things to understand

### How the listing wizard works

The wizard uses `react-hook-form` with `FormProvider` so all 5 steps share one form:

```
ListingFormWizard (holds useForm + FormProvider)
  → Step 0: BasicInfoStep     (useFormContext to read/write)
  → Step 1: PhotoUploadGallery
  → Step 2: AmenitiesStep
  → Step 3: TierSelectionStep
  → Step 4: TitleUploadStep

On "Next":   form.trigger(STEP_FIELDS[step])  ← validates only current step
On "Submit": handleSubmit(onSubmit)            ← validates everything
```

**Each step reads the form with:**
```typescript
const { register, formState: { errors } } = useFormContext<ListingFormValues>();
```

**STEP_FIELDS** (in `schemas.ts`) maps step index → field names to validate:
```typescript
export const STEP_FIELDS = {
  0: ['title', 'description', 'address', 'city', 'country', 'listingType', 'type', 'price'],
  1: ['photos'],
  2: ['amenityIds'],
  3: ['tier'],
  4: ['confirmTitleAccuracy'],
};
```

### Zod v4 — important difference

This project uses **Zod v4**, not v3. The error param changed:
```typescript
// ❌ Zod v3 (wrong)
z.string({ required_error: 'Field is required' })

// ✅ Zod v4 (correct)
z.string({ error: 'Field is required' })
```

### How numeric fields work

Empty inputs submit as `""` which would fail `z.number()`. We use `z.preprocess`:
```typescript
const optionalNumber = z.preprocess(
  (v) => (v === '' || v === null || v === undefined ? undefined : Number(v)),
  z.number().positive().optional()
);
```

---

## Your first task — Build the Edit Listing page

Create these files:

```
app/(dashboard)/dashboard/listings/[id]/edit/page.tsx
app/(dashboard)/dashboard/listings/[id]/edit/_components/EditListingClient.tsx
```

The page is almost identical to New Listing but:
1. Fetch the existing listing with `useListing(id)`
2. Pass it as `defaultValues` to `ListingFormWizard`
3. Call `useUpdateListing(id)` instead of `createListing` on submit

```typescript
// EditListingClient.tsx
'use client';
import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { useListing } from '@/features/listings/queries/listings.queries';
import { useUpdateListing } from '@/features/listings/queries/listings.queries';
import { ListingFormWizard } from '@/components/forms/ListingFormWizard';

export function EditListingClient() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: listing, isLoading } = useListing(id);
  const { mutateAsync: update } = useUpdateListing(id);

  if (isLoading) return <LoadingSkeleton />;

  return (
    <ListingFormWizard
      defaultValues={listing}
      onSubmit={async (values) => {
        await update(values);
        router.push('/dashboard/listings');
      }}
      onUploadPhoto={...}
      onUploadDoc={...}
    />
  );
}
```

---

## How to add a mutation hook

```typescript
// In features/listings/queries/listings.queries.ts
export function useUpdateListing(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload) => listingsService.updateListing(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.listings.detail(id) });
      qc.invalidateQueries({ queryKey: queryKeys.listings.all });
      toast.success('Listing updated.');
    },
    onError: (e: Error) => toast.error(e.message),
  });
}
```

---

## How `TitleCard` mint button works

The `TitleCard` component has an `onMint` prop. Right now it's wired to a toast
mock in `TitlesClient.tsx`. When Dev 5 builds the contract service, update it:

```typescript
// TitlesClient.tsx — swap mock for real call
import { useMintTitle } from '@/features/titles/queries/titles.queries';

const { mutate: mintTitle, isPending } = useMintTitle();

<TitleCard
  title={title}
  onMint={(titleId) => mintTitle(titleId)}
  isMinting={isPending}
/>
```
