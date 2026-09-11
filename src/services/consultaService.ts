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
    if (Array.isArray(data)) return data;
    if (data && Array.isArray(data.content)) return data.content;
    return [];
  },
  getById: async (id: string) => (await api.get(`/consultas/${id}`)).data,
  create: async (consulta: ConsultaPayload) => (await api.post('/consultas', consulta)).data,
  update: async (id: string, consulta: Partial<ConsultaPayload>) =>
    (await api.put(`/consultas/${id}`, consulta)).data,
  cancelar: async (id: string) => {
    const { data } = await api.put(`/consultas/${id}`, { status: 'CANCELADA' });
    return data;
  },
  finalizar: async (id: string) => {
    const { data } = await api.put(`/consultas/${id}`, { status: 'REALIZADA' });
    return data;
  },
  enviarLembrete: async (id: string) => {
    // Este endpoint deve existir na sua API Java (ex: POST /api/lembretes ou /api/consultas/{id}/lembrete)
    const { data } = await api.post('/lembretes', { consultaId: id });
    return data;
  },
  delete: async (id: string) => { await api.delete(`/consultas/${id}`); },
};