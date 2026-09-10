import api from './api';

export type CadastroPayload = {
  nome: string;
  email: string;
  senha: string;
  crmv: string;
  telefone?: string;
  especialidade?: string;
};

export const authService = {
  login: async (email: string, senha: string) => {
    const { data } = await api.post('/auth/login', { email, senha });
    return data;
  },
  cadastrar: async (payload: CadastroPayload) => {
    // Este endpoint precisa existir na sua API Java: POST /api/veterinarios
    const { data } = await api.post('/veterinarios', payload);
    return data;
  },
};