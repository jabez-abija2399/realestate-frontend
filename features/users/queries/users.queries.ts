import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { usersService } from '../services/users.service';
import { queryKeys } from '@/lib/query/query-keys';
import type { UserRole } from '@/types';

export function useUsers() {
  return useQuery({
    queryKey: queryKeys.admin.users.list(),
    queryFn: usersService.getUsers,
  });
}

export function useVerifyUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: usersService.verifyUser,
    onSuccess: () => { qc.invalidateQueries({ queryKey: queryKeys.admin.users.all }); toast.success('User verified.'); },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useSuspendUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: usersService.suspendUser,
    onSuccess: () => { qc.invalidateQueries({ queryKey: queryKeys.admin.users.all }); toast.success('User suspended.'); },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useChangeRole() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, role }: { id: string; role: UserRole }) => usersService.changeRole(id, role),
    onSuccess: () => { qc.invalidateQueries({ queryKey: queryKeys.admin.users.all }); toast.success('Role updated.'); },
    onError: (e: Error) => toast.error(e.message),
  });
}
