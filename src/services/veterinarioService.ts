import api from './api';

export const veterinarioService = {
  getAll: async () => (await api.get('/veterinarios')).data,
  getById: async (id: string) => (await api.get(`/veterinarios/${id}`)).data,
  create: async (vet: any) => (await api.post('/veterinarios', vet)).data,
  update: async (id: string, vet: any) => (await api.put(`/veterinarios/${id}`, vet)).data,
  delete: async (id: string) => { await api.delete(`/veterinarios/${id}`); },
};