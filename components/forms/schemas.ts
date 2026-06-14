import { z } from 'zod';

/**
 * schemas.ts — single source of truth for the listing form Zod schema.
 *
 * Rules applied per the spec:
 *  - z.preprocess on numeric fields: coerces empty string → undefined
 *    so optional number fields don't fail validation when left blank.
 *  - z.boolean().refine(v => v === true) for checkbox confirmations:
 *    keeps the inferred type as `boolean` (not `true`) so default values
 *    of `false` work correctly with react-hook-form.
 *  - STEP_FIELDS maps each wizard step index to its field names so
 *    trigger(STEP_FIELDS[step]) validates only the current step's fields.
 */

// ── Re-usable coerce helper ───────────────────────────────────────────────────

const optionalNumber = z.preprocess(
  (v) => (v === '' || v === null || v === undefined ? undefined : Number(v)),
  z.number().positive().optional()
);

const requiredNumber = z.preprocess(
  (v) => (v === '' || v === null || v === undefined ? undefined : Number(v)),
  z.number({ required_error: 'Required' }).positive('Must be a positive number')
);

// ── Step 1 — Basic Info ───────────────────────────────────────────────────────

export const basicInfoSchema = z.object({
  title: z
    .string({ required_error: 'Title is required' })
    .min(5, 'At least 5 characters')
    .max(100, 'Max 100 characters'),

  description: z
    .string({ required_error: 'Description is required' })
    .min(20, 'At least 20 characters')
    .max(3000, 'Max 3000 characters'),

  address: z.string({ required_error: 'Address is required' }).min(5, 'Enter a full address'),

  city: z.string({ required_error: 'City is required' }).min(2, 'Enter a city'),

  country: z.string({ required_error: 'Country is required' }).min(2, 'Enter a country'),

  lat: z.preprocess(
    (v) => (v === '' || v === null || v === undefined ? undefined : Number(v)),
    z.number().min(-90).max(90).optional()
  ),

  lng: z.preprocess(
    (v) => (v === '' || v === null || v === undefined ? undefined : Number(v)),
    z.number().min(-180).max(180).optional()
  ),

  listingType: z.enum(['sale', 'rent'], { required_error: 'Select listing type' }),

  type: z.enum(['residential', 'commercial'], { required_error: 'Select property type' }),

  price: requiredNumber,

  currency: z.string().default('USD'),

  beds: optionalNumber,
  baths: optionalNumber,
  sqft: optionalNumber,
  yearBuilt: optionalNumber,
  parkingSpaces: optionalNumber,
});

// ── Step 2 — Photos ───────────────────────────────────────────────────────────

export const photosSchema = z.object({
  photos: z
    .array(z.string().url('Invalid photo URL'))
    .min(1, 'Upload at least one photo')
    .max(20, 'Maximum 20 photos'),
});

// ── Step 3 — Amenities ────────────────────────────────────────────────────────

export const AVAILABLE_AMENITIES = [
  { id: 'wifi',         label: 'Wi-Fi' },
  { id: 'ac',           label: 'Air Conditioning' },
  { id: 'gym',          label: 'Gym' },
  { id: 'pool',         label: 'Swimming Pool' },
  { id: 'parking',      label: 'Parking' },
  { id: 'security',     label: 'Security / CCTV' },
  { id: 'elevator',     label: 'Elevator' },
  { id: 'generator',    label: 'Generator' },
  { id: 'solar',        label: 'Solar Power' },
  { id: 'garden',       label: 'Garden' },
  { id: 'balcony',      label: 'Balcony' },
  { id: 'laundry',      label: 'Laundry' },
  { id: 'storage',      label: 'Storage Room' },
  { id: 'ev_charging',  label: 'EV Charging' },
] as const;

export type AmenityId = (typeof AVAILABLE_AMENITIES)[number]['id'];

export const amenitiesSchema = z.object({
  amenityIds: z.array(z.string()).default([]),
});

// ── Step 4 — Tier & Pricing ───────────────────────────────────────────────────

export const tierSchema = z.object({
  tier: z.enum(['basic', 'premium', 'featured'], {
    required_error: 'Select a listing tier',
  }),

  // Rental-specific
  leaseDurationMonths: optionalNumber,
  depositAmount: optionalNumber,

  // Ownership confirmation (for sale listings)
  confirmOwnership: z
    .boolean()
    .refine((v) => v === true, {
      message: 'You must confirm you are the legal owner',
    })
    .optional(),
});

// ── Step 5 — Title Documents ──────────────────────────────────────────────────

export const titleSchema = z.object({
  titleDocumentUrl: z.string().url('Upload a valid document').optional(),

  confirmTitleAccuracy: z
    .boolean()
    .refine((v) => v === true, {
      message: 'Confirm the title document is accurate',
    }),

  // Optional: pre-existing on-chain token ID for re-listing
  existingTokenId: z.string().optional(),
});

// ── Full merged schema ────────────────────────────────────────────────────────

export const listingFormSchema = basicInfoSchema
  .merge(photosSchema)
  .merge(amenitiesSchema)
  .merge(tierSchema)
  .merge(titleSchema);

export type ListingFormValues = z.infer<typeof listingFormSchema>;

// ── Step field map — used with form.trigger(STEP_FIELDS[step]) ────────────────

export const STEP_FIELDS: Record<number, (keyof ListingFormValues)[]> = {
  0: ['title', 'description', 'address', 'city', 'country', 'listingType', 'type', 'price'],
  1: ['photos'],
  2: ['amenityIds'],
  3: ['tier'],
  4: ['confirmTitleAccuracy'],
};

// ── Default values ────────────────────────────────────────────────────────────

export const LISTING_FORM_DEFAULTS: Partial<ListingFormValues> = {
  listingType: 'sale',
  type: 'residential',
  currency: 'USD',
  tier: 'basic',
  photos: [],
  amenityIds: [],
  confirmTitleAccuracy: false,
  confirmOwnership: false,
};
