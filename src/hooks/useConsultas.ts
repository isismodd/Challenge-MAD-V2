import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { consultaService, ConsultaPayload } from '../services/consultaService';

export function useConsultas() {
  return useQuery({ queryKey: ['consultas'], queryFn: consultaService.getAll });
}
export function useCriarConsulta() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (c: ConsultaPayload) => consultaService.create(c),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['consultas'] }),
  });
}
export function useAtualizarConsulta() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, consulta }: { id: string; consulta: Partial<ConsultaPayload> }) => consultaService.update(id, consulta),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['consultas'] }),
  });
}
export function useDeletarConsulta() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => consultaService.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['consultas'] }),
  });
}