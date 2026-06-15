import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { tenantsService } from '../services/tenants.service';
import { queryKeys } from '@/lib/query/query-keys';

export function useTenants() {
  return useQuery({ queryKey: queryKeys.tenants.list(), queryFn: tenantsService.getTenants });
}

export function useCreateTenant() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: tenantsService.createTenant,
    onSuccess: () => { qc.invalidateQueries({ queryKey: queryKeys.tenants.all }); toast.success('Tenant added.'); },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useUpdateTenant(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: Parameters<typeof tenantsService.updateTenant>[1]) =>
      tenantsService.updateTenant(id, payload),
    onSuccess: () => { qc.invalidateQueries({ queryKey: queryKeys.tenants.all }); toast.success('Tenant updated.'); },
    onError: (e: Error) => toast.error(e.message),
  });
}
