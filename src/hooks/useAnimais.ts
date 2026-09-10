import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { animalService, AnimalPayload } from '../services/animalService';

export function useAnimais() {
  return useQuery({ queryKey: ['animais'], queryFn: animalService.getAll });
}
export function useAnimal(id: string) {
  return useQuery({ queryKey: ['animais', id], queryFn: () => animalService.getById(id), enabled: !!id });
}
export function useCriarAnimal() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (a: AnimalPayload) => animalService.create(a),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['animais'] }),
  });
}
export function useAtualizarAnimal() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, animal }: { id: string; animal: Partial<AnimalPayload> }) => animalService.update(id, animal),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['animais'] }),
  });
}
export function useDeletarAnimal() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => animalService.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['animais'] }),
  });
}