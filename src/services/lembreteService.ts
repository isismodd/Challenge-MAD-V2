import api from './api';

export const lembreteService = {
  getAll: async () => {
    const { data } = await api.get('/lembretes');

    if (Array.isArray(data)) return data;

    if (data && Array.isArray(data.content)) {
      return data.content;
    }

    return [];
  },

  getById: async (id: string) => {
    return (await api.get(`/lembretes/${id}`)).data;
  },

  create: async (lembrete: any) => {
    return (await api.post('/lembretes', lembrete)).data;
  },

  update: async (id: string, lembrete: any) => {
    return (await api.put(`/lembretes/${id}`, lembrete)).data;
  },

  delete: async (id: string) => {
    await api.delete(`/lembretes/${id}`);
  },

  // Envia todos os lembretes pendentes
  enviarTodosPendentes: async () => {
    const { data } = await api.post('/lembretes/enviar-todos');
    return data;
  },
};