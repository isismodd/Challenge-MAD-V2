import api from './api';

export type ConsultaPayload = {
  animalId: number;
  veterinarioId: number;
  dataHora: string;
  motivo?: string;
  diagnostico?: string;
  prescricao?: string;
  status: 'AGENDADA' | 'REALIZADA' | 'CANCELADA';
};

export const consultaService = {
  getAll: async () => {
    const { data } = await api.get('/consultas');

    if (Array.isArray(data)) {
      return data;
    }

    if (data && Array.isArray(data.content)) {
      return data.content;
    }

    return [];
  },

  getById: async (id: string) => {
    const { data } = await api.get(`/consultas/${id}`);
    return data;
  },

  create: async (consulta: ConsultaPayload) => {
    const { data } = await api.post('/consultas', consulta);
    return data;
  },

  update: async (
    id: string,
    consulta: Partial<ConsultaPayload>
  ) => {
    const { data } = await api.put(
      `/consultas/${id}`,
      consulta
    );

    return data;
  },

  cancelar: async (consultaCompleta: any) => {
    const payload = {
      animalId: consultaCompleta.animalId,
      veterinarioId: consultaCompleta.veterinarioId,
      dataHora: consultaCompleta.dataHora,
      motivo: consultaCompleta.motivo || '',
      diagnostico: consultaCompleta.diagnostico || '',
      prescricao: consultaCompleta.prescricao || '',
      status: 'CANCELADA',
    };

    const { data } = await api.put(
      `/consultas/${consultaCompleta.id}`,
      payload
    );

    return data;
  },

  finalizar: async (consultaCompleta: any) => {
    const payload = {
      animalId: consultaCompleta.animalId,
      veterinarioId: consultaCompleta.veterinarioId,
      dataHora: consultaCompleta.dataHora,
      motivo: consultaCompleta.motivo || '',
      diagnostico: consultaCompleta.diagnostico || '',
      prescricao: consultaCompleta.prescricao || '',
      status: 'REALIZADA',
    };

    const { data } = await api.put(
      `/consultas/${consultaCompleta.id}`,
      payload
    );

    return data;
  },

  // Cria o lembrete completo usando os dados
  // da consulta e do animal no backend
  enviarLembrete: async (id: string) => {
    const { data } = await api.post(
      `/lembretes/criar/${id}`
    );

    return data;
  },

  delete: async (id: string) => {
    await api.delete(`/consultas/${id}`);
  },
};