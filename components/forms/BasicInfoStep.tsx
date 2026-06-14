'use client';

import { useFormContext } from 'react-hook-form';
import { FormField } from '@/components/ui/FormField';
import { inputClass, selectClass, selectWrapClass, textareaClass, inputErrorClass } from './styles';
import { cn } from '@/lib/utils';
import type { ListingFormValues } from './schemas';

/**
 * BasicInfoStep — Step 1 of the listing wizard.
 * Reads/writes via useFormContext — must be rendered inside <FormProvider>.
 */

export function BasicInfoStep() {
  const {
    register,
    formState: { errors },
  } = useFormContext<ListingFormValues>();

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

      {/* Title — full width */}
      <div className="sm:col-span-2">
        <FormField label="Property Title" error={errors.title?.message} required>
          <input
            {...register('title')}
            placeholder="e.g. Modern 3-Bedroom Apartment in Bole"
            className={cn(inputClass, errors.title && inputErrorClass)}
          />
        </FormField>
      </div>

      {/* Description — full width */}
      <div className="sm:col-span-2">
        <FormField label="Description" error={errors.description?.message} required>
          <textarea
            {...register('description')}
            rows={5}
            placeholder="Describe the property, neighbourhood, and any notable features…"
            className={cn(textareaClass, errors.description && inputErrorClass)}
          />
        </FormField>
      </div>

      {/* Address */}
      <div className="sm:col-span-2">
        <FormField label="Street Address" error={errors.address?.message} required>
          <input
            {...register('address')}
            placeholder="e.g. Bole Road, House 42"
            className={cn(inputClass, errors.address && inputErrorClass)}
          />
        </FormField>
      </div>

      {/* City */}
      <FormField label="City" error={errors.city?.message} required>
        <input
          {...register('city')}
          placeholder="e.g. Addis Ababa"
          className={cn(inputClass, errors.city && inputErrorClass)}
        />
      </FormField>

      {/* Country */}
      <FormField label="Country" error={errors.country?.message} required>
        <input
          {...register('country')}
          placeholder="e.g. Ethiopia"
          className={cn(inputClass, errors.country && inputErrorClass)}
        />
      </FormField>

      {/* Listing type */}
      <FormField label="Listing Type" error={errors.listingType?.message} required>
        <div className={selectWrapClass}>
          <select
            {...register('listingType')}
            className={cn(selectClass, errors.listingType && inputErrorClass)}
          >
            <option value="sale">For Sale</option>
            <option value="rent">For Rent</option>
          </select>
        </div>
      </FormField>

      {/* Property type */}
      <FormField label="Property Type" error={errors.type?.message} required>
        <div className={selectWrapClass}>
          <select
            {...register('type')}
            className={cn(selectClass, errors.type && inputErrorClass)}
          >
            <option value="residential">Residential</option>
            <option value="commercial">Commercial</option>
          </select>
        </div>
      </FormField>

      {/* Price */}
      <FormField
        label="Price (USD)"
        error={errors.price?.message}
        required
        hint="Enter the sale price or monthly rent"
      >
        <input
          {...register('price')}
          type="number"
          min={0}
          placeholder="e.g. 250000"
          className={cn(inputClass, errors.price && inputErrorClass)}
        />
      </FormField>

      {/* Beds */}
      <FormField label="Bedrooms" error={errors.beds?.message}>
        <input
          {...register('beds')}
          type="number"
          min={0}
          placeholder="e.g. 3"
          className={cn(inputClass, errors.beds && inputErrorClass)}
        />
      </FormField>

      {/* Baths */}
      <FormField label="Bathrooms" error={errors.baths?.message}>
        <input
          {...register('baths')}
          type="number"
          min={0}
          placeholder="e.g. 2"
          className={cn(inputClass, errors.baths && inputErrorClass)}
        />
      </FormField>

      {/* Sqft */}
      <FormField label="Area (sqft)" error={errors.sqft?.message}>
        <input
          {...register('sqft')}
          type="number"
          min={0}
          placeholder="e.g. 1200"
          className={cn(inputClass, errors.sqft && inputErrorClass)}
        />
      </FormField>

      {/* Year built */}
      <FormField label="Year Built" error={errors.yearBuilt?.message}>
        <input
          {...register('yearBuilt')}
          type="number"
          min={1800}
          max={new Date().getFullYear()}
          placeholder="e.g. 2018"
          className={cn(inputClass, errors.yearBuilt && inputErrorClass)}
        />
      </FormField>

      {/* Coordinates — collapsed hint */}
      <div className="sm:col-span-2 grid grid-cols-2 gap-4">
        <FormField
          label="Latitude"
          error={errors.lat?.message}
          hint="Optional — enables map pin"
        >
          <input
            {...register('lat')}
            type="number"
            step="any"
            placeholder="e.g. 9.0258"
            className={cn(inputClass, errors.lat && inputErrorClass)}
          />
        </FormField>
        <FormField
          label="Longitude"
          error={errors.lng?.message}
          hint="Optional — enables map pin"
        >
          <input
            {...register('lng')}
            type="number"
            step="any"
            placeholder="e.g. 38.7578"
            className={cn(inputClass, errors.lng && inputErrorClass)}
          />
        </FormField>
      </div>
    </div>
  );
}
