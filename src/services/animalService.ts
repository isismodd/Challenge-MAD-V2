import api from './api';

export type AnimalPayload = {
  nome: string; especie: string; raca: string; idade: number; peso: number;
  sexo: 'M' | 'F'; tutorNome: string; tutorTelefone: string;
  tutorEmail?: string; observacoes?: string;
};

export const animalService = {
  getAll: async () => {
    const { data } = await api.get('/animais');
    if (Array.isArray(data)) return data;
    if (data && Array.isArray(data.content)) return data.content;
    return [];
  },
  getById: async (id: string) => (await api.get(`/animais/${id}`)).data,
  create: async (animal: AnimalPayload) => (await api.post('/animais', animal)).data,
  update: async (id: string, animal: Partial<AnimalPayload>) => (await api.put(`/animais/${id}`, animal)).data,
  delete: async (id: string) => { await api.delete(`/animais/${id}`); },
};