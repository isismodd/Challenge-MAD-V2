// src/model/User.ts
export type User = {
  id: string;
  nome: string;
  email: string;
  tipo: 'vet' | 'tutor';
  token: string;
};

export type Veterinario = User & {
  especialidade: string;
  crv: string;
  telefone?: string;
};

export type Tutor = User & {
  telefone: string;
  endereco?: string;
  cpf?: string;
};

// Dados mockados
export const mockVeterinario: Veterinario = {
  id: '1',
  nome: 'Dr. Carlos Silva',
  email: 'vet@clivovet.com',
  tipo: 'vet',
  token: 'mock-token-vet-123',
  especialidade: 'Clínico Geral',
  crv: 'CRV-SP 12345',
  telefone: '(11) 98765-4321'
};

export const mockTutor: Tutor = {
  id: '2',
  nome: 'Ana Souza',
  email: 'tutor@clivovet.com',
  tipo: 'tutor',
  token: 'mock-token-tutor-123',
  telefone: '(11) 99999-8888',
  endereco: 'Rua das Flores, 123 - São Paulo/SP',
  cpf: '123.456.789-00'
};