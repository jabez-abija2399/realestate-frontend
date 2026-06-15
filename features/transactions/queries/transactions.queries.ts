import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { transactionsService } from '../services/transactions.service';
import { queryKeys } from '@/lib/query/query-keys';

export function useMyTransactions() {
  return useQuery({ queryKey: queryKeys.transactions.mine(), queryFn: transactionsService.getMine });
}

export function useAllTransactions() {
  return useQuery({ queryKey: queryKeys.transactions.list(), queryFn: transactionsService.getAll });
}

export function useCreateTransaction() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: transactionsService.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.transactions.all });
      toast.success('Transaction initiated.');
    },
    onError: (e: Error) => toast.error(e.message),
  });
}
