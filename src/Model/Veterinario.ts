// src/model/Veterinario.ts
import { User } from './User';

export type Veterinario = User & {
  especialidade: string;
  crv: string; // Registro no Conselho Regional de Veterinária
  telefone?: string;
  clinica?: string;
  horarioAtendimento?: string;
};

// Dados mockados de veterinários
export const mockVeterinarios: Veterinario[] = [
  {
    id: '1',
    nome: 'Dr. Carlos Silva',
    email: 'vet@clivovet.com',
    tipo: 'vet',
    token: 'mock-token-vet-123',
    especialidade: 'Clínico Geral',
    crv: 'CRV-SP 12345',
    telefone: '(11) 98765-4321',
    clinica: 'Clínica Pet Saúde',
    horarioAtendimento: 'Seg-Sex 9h às 18h',
  },
  {
    id: '2',
    nome: 'Dra. Mariana Costa',
    email: 'mariana@clivovet.com',
    tipo: 'vet',
    token: 'mock-token-vet-456',
    especialidade: 'Dermatologia Veterinária',
    crv: 'CRV-SP 67890',
    telefone: '(11) 97654-3210',
    clinica: 'DermaPet',
    horarioAtendimento: 'Seg-Sex 10h às 19h',
  },
];