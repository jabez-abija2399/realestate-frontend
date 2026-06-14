'use client';

import { useFormContext, useWatch } from 'react-hook-form';
import { cn } from '@/lib/utils';
import { AVAILABLE_AMENITIES } from './schemas';
import type { ListingFormValues } from './schemas';

/**
 * AmenitiesStep — Step 3 of the listing wizard.
 * Toggleable amenity chips, stored as an array of IDs in the form state.
 */

export function AmenitiesStep() {
  const { setValue, control, formState: { errors } } = useFormContext<ListingFormValues>();
  const selectedIds: string[] = useWatch({ control, name: 'amenityIds' }) ?? [];

  function toggle(id: string) {
    const next = selectedIds.includes(id)
      ? selectedIds.filter((s) => s !== id)
      : [...selectedIds, id];
    setValue('amenityIds', next, { shouldValidate: true, shouldDirty: true });
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <p className="text-sm font-medium text-gray-700">
          Select all amenities that apply
        </p>
        <p className="mt-0.5 text-xs text-gray-400">
          {selectedIds.length} selected
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
        {AVAILABLE_AMENITIES.map((amenity) => {
          const active = selectedIds.includes(amenity.id);
          return (
            <button
              key={amenity.id}
              type="button"
              onClick={() => toggle(amenity.id)}
              aria-pressed={active}
              className={cn(
                'flex items-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors text-left',
                active
                  ? 'border-emerald-600 bg-emerald-50 text-emerald-700'
                  : 'border-gray-200 bg-white text-gray-600 hover:border-emerald-300 hover:bg-emerald-50/50'
              )}
            >
              {/* Toggle indicator */}
              <span
                className={cn(
                  'flex h-4 w-4 shrink-0 items-center justify-center rounded border-2 transition-colors',
                  active ? 'border-emerald-600 bg-emerald-600' : 'border-gray-300'
                )}
                aria-hidden="true"
              >
                {active && (
                  <svg viewBox="0 0 10 8" fill="none" className="h-2.5 w-2.5 text-white">
                    <path d="M1 4l3 3 5-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </span>
              {amenity.label}
            </button>
          );
        })}
      </div>

      {errors.amenityIds && (
        <p role="alert" className="text-xs text-red-600">
          {errors.amenityIds.message as string}
        </p>
      )}
    </div>
  );
}
