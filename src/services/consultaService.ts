import api from './api';

export type ConsultaPayload = {
  animalId: number; veterinarioId: number; dataHora: string;
  motivo?: string; diagnostico?: string; prescricao?: string;
  status: 'AGENDADA' | 'REALIZADA' | 'CANCELADA';
};

export const consultaService = {
  getAll: async () => (await api.get('/consultas')).data,
  getById: async (id: string) => (await api.get(`/consultas/${id}`)).data,
  create: async (consulta: ConsultaPayload) => (await api.post('/consultas', consulta)).data,
  update: async (id: string, consulta: Partial<ConsultaPayload>) => (await api.put(`/consultas/${id}`, consulta)).data,
  delete: async (id: string) => { await api.delete(`/consultas/${id}`); },
};