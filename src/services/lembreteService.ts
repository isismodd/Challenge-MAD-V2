import api from './api';

export const lembreteService = {
  getAll: async () => (await api.get('/lembretes')).data,
  getById: async (id: string) => (await api.get(`/lembretes/${id}`)).data,
  create: async (lembrete: any) => (await api.post('/lembretes', lembrete)).data,
  update: async (id: string, lembrete: any) => (await api.put(`/lembretes/${id}`, lembrete)).data,
  delete: async (id: string) => { await api.delete(`/lembretes/${id}`); },
};