'use client';

import { useFormContext, useWatch } from 'react-hook-form';
import { Check, Star, Zap } from 'lucide-react';
import { FormField } from '@/components/ui/FormField';
import { inputClass, checkboxClass, inputErrorClass } from './styles';
import { cn } from '@/lib/utils';
import type { ListingFormValues, ListingTier } from './schemas';
import type { LucideIcon } from 'lucide-react';

/**
 * TierSelectionStep — Step 4 of the listing wizard.
 * Tier card selector + rental/sale-specific fields.
 */

interface TierOption {
  value: ListingTier;
  label: string;
  description: string;
  icon: LucideIcon;
  price: string;
  features: string[];
  highlight?: boolean;
}

const TIERS: TierOption[] = [
  {
    value: 'basic',
    label: 'Basic',
    description: 'Standard listing visibility',
    icon: Check,
    price: 'Free',
    features: ['Listed in search results', 'Up to 5 photos', 'Standard placement'],
  },
  {
    value: 'premium',
    label: 'Premium',
    description: 'Boosted visibility + more photos',
    icon: Zap,
    price: '$29/month',
    features: ['Priority placement', 'Up to 15 photos', 'Featured in category', 'Analytics dashboard'],
    highlight: true,
  },
  {
    value: 'featured',
    label: 'Featured',
    description: 'Maximum exposure on homepage',
    icon: Star,
    price: '$79/month',
    features: ['Homepage featured section', 'Up to 20 photos', 'Social media boost', 'Dedicated support', 'Full analytics'],
  },
];

export function TierSelectionStep() {
  const {
    register,
    setValue,
    watch,
    control,
    formState: { errors },
  } = useFormContext<ListingFormValues>();

  const selectedTier = useWatch({ control, name: 'tier' });
  const listingType  = watch('listingType');

  return (
    <div className="flex flex-col gap-6">

      {/* Tier cards */}
      <div>
        <p className="mb-3 text-sm font-medium text-gray-700">
          Select a listing tier
        </p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {TIERS.map((tier) => {
            const Icon = tier.icon;
            const active = selectedTier === tier.value;
            return (
              <button
                key={tier.value}
                type="button"
                onClick={() => setValue('tier', tier.value, { shouldValidate: true })}
                aria-pressed={active}
                className={cn(
                  'relative flex flex-col rounded-xl border-2 p-4 text-left transition-all',
                  active
                    ? 'border-emerald-600 bg-emerald-50/50 shadow-sm'
                    : 'border-gray-200 bg-white hover:border-emerald-300',
                  tier.highlight && !active && 'border-violet-200 bg-violet-50/30'
                )}
              >
                {tier.highlight && (
                  <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 rounded-full bg-violet-600 px-3 py-0.5 text-xs font-semibold text-white">
                    Popular
                  </span>
                )}

                <div className={cn(
                  'mb-3 inline-flex h-9 w-9 items-center justify-center rounded-lg',
                  active ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-500'
                )}>
                  <Icon size={18} aria-hidden="true" />
                </div>

                <p className="font-semibold text-gray-900">{tier.label}</p>
                <p className="mt-0.5 text-xs text-gray-500">{tier.description}</p>
                <p className="mt-2 text-sm font-bold text-emerald-600">{tier.price}</p>

                <ul className="mt-3 flex flex-col gap-1.5">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-1.5 text-xs text-gray-600">
                      <Check size={12} className="mt-0.5 shrink-0 text-emerald-500" aria-hidden="true" />
                      {f}
                    </li>
                  ))}
                </ul>

                {/* Active ring */}
                {active && (
                  <span className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600">
                    <Check size={12} className="text-white" aria-hidden="true" />
                  </span>
                )}
              </button>
            );
          })}
        </div>
        {errors.tier && (
          <p role="alert" className="mt-2 text-xs text-red-600">{errors.tier.message}</p>
        )}
      </div>

      {/* Rental-specific fields */}
      {listingType === 'rent' && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField label="Lease Duration (months)" error={errors.leaseDurationMonths?.message} hint="Leave blank for flexible duration">
            <input
              {...register('leaseDurationMonths')}
              type="number"
              min={1}
              placeholder="e.g. 12"
              className={cn(inputClass, errors.leaseDurationMonths && inputErrorClass)}
            />
          </FormField>
          <FormField label="Security Deposit (USD)" error={errors.depositAmount?.message}>
            <input
              {...register('depositAmount')}
              type="number"
              min={0}
              placeholder="e.g. 2000"
              className={cn(inputClass, errors.depositAmount && inputErrorClass)}
            />
          </FormField>
        </div>
      )}

      {/* Ownership confirmation — sale only */}
      {listingType === 'sale' && (
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            {...register('confirmOwnership')}
            type="checkbox"
            className={cn(checkboxClass, 'mt-0.5', errors.confirmOwnership && 'border-red-400')}
          />
          <span className="text-sm text-gray-700">
            I confirm that I am the legal owner of this property and have the right to list it for sale.
          </span>
        </label>
      )}
      {errors.confirmOwnership && (
        <p role="alert" className="text-xs text-red-600">{errors.confirmOwnership.message}</p>
      )}
    </div>
  );
}
