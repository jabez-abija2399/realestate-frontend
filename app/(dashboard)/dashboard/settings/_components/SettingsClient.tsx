'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { FormField } from '@/components/ui/FormField';
import { Button } from '@/components/ui/Button';
import { WalletConnectButton } from '@/components/ui/WalletConnectButton';
import { ComplianceStatus, type ComplianceItem } from '@/components/owner/ComplianceStatus';
import { inputClass, inputErrorClass } from '@/components/forms/styles';
import { cn } from '@/lib/utils';

const profileSchema = z.object({
  name:  z.string().min(2, 'At least 2 characters'),
  email: z.string().email('Enter a valid email'),
  phone: z.string().optional(),
});

type ProfileValues = z.infer<typeof profileSchema>;

const MOCK_COMPLIANCE: ComplianceItem[] = [
  { id: 'kyc',    label: 'Identity Verification (KYC)', status: 'verified',      updatedAt: new Date(Date.now() - 30 * 86400000).toISOString() },
  { id: 'aml',    label: 'AML Screening',               status: 'verified',      updatedAt: new Date(Date.now() - 30 * 86400000).toISOString() },
  { id: 'broker', label: 'Broker Licence',              status: 'not_submitted',  note: 'Required to list commercial properties.' },
];

export function SettingsClient() {
  const { register, handleSubmit, formState: { errors, isDirty, isSubmitting } } =
    useForm<ProfileValues>({
      resolver: zodResolver(profileSchema),
      defaultValues: { name: 'Demo User', email: 'demo@swafirre.com', phone: '' },
    });

  const onSubmit = handleSubmit(async (_values) => {
    await new Promise((r) => setTimeout(r, 600)); // mock save
    toast.success('Profile updated.');
  });

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Settings</h1>
        <p className="mt-1 text-sm text-gray-500">Manage your profile, wallet, and compliance status.</p>
      </div>

      {/* Profile form */}
      <Card>
        <CardHeader><CardTitle>Profile</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
            <FormField label="Full Name" error={errors.name?.message} required>
              <input {...register('name')} className={cn(inputClass, errors.name && inputErrorClass)} />
            </FormField>
            <FormField label="Email" error={errors.email?.message} required>
              <input {...register('email')} type="email" className={cn(inputClass, errors.email && inputErrorClass)} />
            </FormField>
            <FormField label="Phone" error={errors.phone?.message} hint="Optional">
              <input {...register('phone')} type="tel" placeholder="+251 9XX XXX XXX" className={inputClass} />
            </FormField>
            <div className="flex justify-end">
              <Button type="submit" loading={isSubmitting} disabled={!isDirty}>
                Save Changes
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Wallet */}
      <Card>
        <CardHeader><CardTitle>Wallet Connection</CardTitle></CardHeader>
        <CardContent>
          <p className="mb-4 text-sm text-gray-500">
            Connect your wallet to verify on-chain ownership and sign transactions.
          </p>
          <WalletConnectButton />
        </CardContent>
      </Card>

      {/* Compliance */}
      <Card>
        <CardHeader><CardTitle>Compliance Status</CardTitle></CardHeader>
        <CardContent>
          <ComplianceStatus items={MOCK_COMPLIANCE} />
        </CardContent>
      </Card>
    </div>
  );
}
