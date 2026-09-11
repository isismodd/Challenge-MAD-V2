import api from './api';

export const veterinarioService = {
  getAll: async () => {
    const { data } = await api.get('/veterinarios');
    // Garante que sempre retorne um array, mesmo se a API retornar { content: [...] }
    if (Array.isArray(data)) return data;
    if (data && Array.isArray(data.content)) return data.content;
    return [];
  },
  getById: async (id: string) => (await api.get(`/veterinarios/${id}`)).data,
  create: async (vet: any) => (await api.post('/veterinarios', vet)).data,
  update: async (id: string, vet: any) => (await api.put(`/veterinarios/${id}`, vet)).data,
  delete: async (id: string) => { await api.delete(`/veterinarios/${id}`); },
};