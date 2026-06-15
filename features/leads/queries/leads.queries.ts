import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { leadsService } from '../services/leads.service';
import { queryKeys } from '@/lib/query/query-keys';

export function useLeads() {
  return useQuery({ queryKey: queryKeys.leads.list(), queryFn: leadsService.getLeads });
}

export function useLeadsByListing(listingId: string) {
  return useQuery({
    queryKey: queryKeys.leads.byListing(listingId),
    queryFn: () => leadsService.getLeadsByListing(listingId),
    enabled: !!listingId,
  });
}

export function useUpdateLead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Parameters<typeof leadsService.updateLead>[1] }) =>
      leadsService.updateLead(id, payload),
    onSuccess: () => { qc.invalidateQueries({ queryKey: queryKeys.leads.all }); toast.success('Lead updated.'); },
    onError: (e: Error) => toast.error(e.message),
  });
}
