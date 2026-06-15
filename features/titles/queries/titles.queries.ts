import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { titlesService } from '../services/titles.service';
import { queryKeys } from '@/lib/query/query-keys';

export function useTitles() {
  return useQuery({
    queryKey: queryKeys.titles.list(),
    queryFn: titlesService.getTitles,
  });
}

export function useMintTitle() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: titlesService.mintTitle,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.titles.all });
      toast.success('Title minted on-chain!');
    },
    onError: (e: Error) => toast.error(e.message ?? 'Minting failed.'),
  });
}
