'use client';

import * as React from 'react';
import { useFormContext } from 'react-hook-form';
import { useDropzone } from 'react-dropzone';
import { FileCheck2, Upload, X } from 'lucide-react';
import { FormField } from '@/components/ui/FormField';
import { checkboxClass, inputClass, inputErrorClass } from './styles';
import { cn } from '@/lib/utils';
import { appConfig } from '@/config/app.config';
import type { ListingFormValues } from './schemas';

/**
 * TitleUploadStep — Step 5 of the listing wizard.
 * Uploads a title document (PDF or image) and collects confirmation checkbox.
 * The actual upload is delegated to a prop so the wizard controls the API call.
 */

interface TitleUploadStepProps {
  onUpload: (file: File) => Promise<string>;
  uploading?: boolean;
}

export function TitleUploadStep({ onUpload, uploading }: TitleUploadStepProps) {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<ListingFormValues>();

  const docUrl = watch('titleDocumentUrl');
  const [fileName, setFileName] = React.useState<string | null>(null);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'application/pdf': [],
      'image/jpeg': [],
      'image/png': [],
    },
    maxSize: appConfig.upload.maxFileSizeBytes,
    maxFiles: 1,
    disabled: uploading,
    onDropAccepted: async ([file]) => {
      setFileName(file.name);
      const url = await onUpload(file);
      setValue('titleDocumentUrl', url, { shouldValidate: true });
    },
  });

  function removeDoc() {
    setValue('titleDocumentUrl', undefined, { shouldValidate: true });
    setFileName(null);
  }

  return (
    <div className="flex flex-col gap-6">

      {/* Info banner */}
      <div className="flex gap-3 rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800">
        <FileCheck2 size={18} className="mt-0.5 shrink-0" aria-hidden="true" />
        <div>
          <p className="font-medium">Why upload a title document?</p>
          <p className="mt-0.5 text-xs text-blue-700">
            The admin team verifies your ownership before minting a digital title NFT.
            Upload a scanned copy of your land certificate, deed, or official title document.
          </p>
        </div>
      </div>

      {/* Dropzone or uploaded file */}
      {docUrl ? (
        <div className="flex items-center justify-between rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3">
          <div className="flex items-center gap-2 text-sm">
            <FileCheck2 size={18} className="text-emerald-600" aria-hidden="true" />
            <span className="font-medium text-emerald-700">
              {fileName ?? 'Document uploaded'}
            </span>
          </div>
          <button
            type="button"
            onClick={removeDoc}
            aria-label="Remove document"
            className="rounded p-1 text-emerald-600 hover:bg-emerald-100"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <div
          {...getRootProps()}
          className={cn(
            'flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-10 text-center transition-colors',
            isDragActive
              ? 'border-emerald-500 bg-emerald-50'
              : 'border-gray-200 bg-gray-50 hover:border-emerald-400 hover:bg-emerald-50/50',
            uploading && 'cursor-not-allowed opacity-50'
          )}
        >
          <input {...getInputProps()} aria-label="Upload title document" />
          <Upload size={24} className="text-gray-400" aria-hidden="true" />
          <div>
            <p className="text-sm font-medium text-gray-700">
              {isDragActive ? 'Drop your document here' : 'Drag & drop or click to upload'}
            </p>
            <p className="mt-0.5 text-xs text-gray-400">
              PDF, JPEG, or PNG · max {appConfig.upload.maxFileSizeBytes / 1024 / 1024}MB
            </p>
          </div>
        </div>
      )}

      {errors.titleDocumentUrl && (
        <p role="alert" className="text-xs text-red-600">{errors.titleDocumentUrl.message}</p>
      )}

      {/* Existing token ID — re-listing flow */}
      <FormField
        label="Existing Token ID (optional)"
        hint="If this property already has an on-chain title, enter the token ID"
        error={errors.existingTokenId?.message}
      >
        <input
          {...register('existingTokenId')}
          placeholder="e.g. 42"
          className={cn(inputClass, errors.existingTokenId && inputErrorClass)}
        />
      </FormField>

      {/* Accuracy confirmation — required */}
      <label className="flex cursor-pointer items-start gap-3">
        <input
          {...register('confirmTitleAccuracy')}
          type="checkbox"
          className={cn(
            checkboxClass,
            'mt-0.5',
            errors.confirmTitleAccuracy && 'border-red-400'
          )}
        />
        <span className="text-sm text-gray-700">
          I confirm that the document I have uploaded is a true and accurate copy of the legal title
          for this property, and I understand that submitting false documents may result in account suspension.
        </span>
      </label>
      {errors.confirmTitleAccuracy && (
        <p role="alert" className="text-xs text-red-600">
          {errors.confirmTitleAccuracy.message}
        </p>
      )}
    </div>
  );
}
