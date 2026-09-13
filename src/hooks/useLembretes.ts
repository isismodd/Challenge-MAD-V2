import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

import { lembreteService } from '../services/lembreteService';

export function useLembretes() {
  return useQuery({
    queryKey: ['lembretes'],
    queryFn: lembreteService.getAll,
  });
}

export function useEnviarTodosPendentes() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => lembreteService.enviarTodosPendentes(),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['lembretes'],
      });
    },
  });
}

export function useDeletarLembrete() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => lembreteService.delete(id),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['lembretes'],
      });
    },
  });
}