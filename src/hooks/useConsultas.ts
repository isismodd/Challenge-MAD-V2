import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

import {
  consultaService,
  ConsultaPayload,
} from '../services/consultaService';

export function useConsultas() {
  return useQuery({
    queryKey: ['consultas'],
    queryFn: consultaService.getAll,
  });
}

export function useConsulta(id: string) {
  return useQuery({
    queryKey: ['consultas', id],
    queryFn: () =>
      consultaService.getById(id),
    enabled: !!id,
  });
}

export function useCriarConsulta() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (consulta: ConsultaPayload) =>
      consultaService.create(consulta),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['consultas'],
      });
    },
  });
}

export function useAtualizarConsulta() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      consulta,
    }: {
      id: string;
      consulta: Partial<ConsultaPayload>;
    }) =>
      consultaService.update(
        id,
        consulta
      ),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['consultas'],
      });
    },
  });
}

export function useCancelarConsulta() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (consultaCompleta: any) =>
      consultaService.cancelar(
        consultaCompleta
      ),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['consultas'],
      });
    },
  });
}

export function useFinalizarConsulta() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (consultaCompleta: any) =>
      consultaService.finalizar(
        consultaCompleta
      ),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['consultas'],
      });
    },
  });
}

export function useEnviarLembrete() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      consultaService.enviarLembrete(id),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['consultas'],
      });

      queryClient.invalidateQueries({
        queryKey: ['lembretes'],
      });
    },
  });
}

export function useDeletarConsulta() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      consultaService.delete(id),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['consultas'],
      });
    },
  });
}