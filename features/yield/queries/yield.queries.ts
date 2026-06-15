import { useQuery } from '@tanstack/react-query';
import { yieldService } from '../services/yield.service';
import { queryKeys } from '@/lib/query/query-keys';

export function useYieldSummary() {
  return useQuery({ queryKey: queryKeys.yield.summary(), queryFn: yieldService.getSummary });
}

export function useYieldHistory() {
  return useQuery({ queryKey: queryKeys.yield.history(), queryFn: yieldService.getHistory });
}
