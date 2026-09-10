import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { lembreteService } from '../services/lembreteService';

export function useLembretes() {
  return useQuery({ queryKey: ['lembretes'], queryFn: lembreteService.getAll });
}
export function useDeletarLembrete() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => lembreteService.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['lembretes'] }),
  });
}