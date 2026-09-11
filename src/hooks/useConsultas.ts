import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { consultaService, ConsultaPayload } from '../services/consultaService';

export function useConsultas() {
  return useQuery({ queryKey: ['consultas'], queryFn: consultaService.getAll });
}

export function useConsulta(id: string) {
  return useQuery({
    queryKey: ['consultas', id],
    queryFn: () => consultaService.getById(id),
    enabled: !!id,
  });
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
    mutationFn: ({ id, consulta }: { id: string; consulta: Partial<ConsultaPayload> }) =>
      consultaService.update(id, consulta),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['consultas'] }),
  });
}

export function useCancelarConsulta() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => consultaService.cancelar(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['consultas'] }),
  });
}

export function useFinalizarConsulta() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => consultaService.finalizar(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['consultas'] }),
  });
}

export function useEnviarLembrete() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => consultaService.enviarLembrete(id),
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