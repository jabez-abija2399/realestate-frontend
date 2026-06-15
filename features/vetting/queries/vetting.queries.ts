import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { vettingService } from '../services/vetting.service';
import { queryKeys } from '@/lib/query/query-keys';

export function useVettingQueue() {
  return useQuery({ queryKey: queryKeys.admin.vettingQueue(), queryFn: vettingService.getQueue });
}

export function useApproveVetting() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: vettingService.approve,
    onSuccess: () => { qc.invalidateQueries({ queryKey: queryKeys.admin.vettingQueue() }); toast.success('Approved.'); },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useRejectVetting() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) => vettingService.reject(id, reason),
    onSuccess: () => { qc.invalidateQueries({ queryKey: queryKeys.admin.vettingQueue() }); toast.success('Rejected.'); },
    onError: (e: Error) => toast.error(e.message),
  });
}
