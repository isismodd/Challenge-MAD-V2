import { User } from './User';

export type Tutor = User & {
  telefone: string;
  endereco?: string;
  cpf?: string;
  dataNascimento?: string;
  animaisIds?: string[]; // IDs dos animais do tutor
};

// Dados mockados de tutores
export const mockTutores: Tutor[] = [
  {
    id: 'tutor1',
    nome: 'Ana Souza',
    email: 'tutor@clivovet.com',
    tipo: 'tutor',
    token: 'mock-token-tutor-123',
    telefone: '(11) 99999-8888',
    endereco: 'Rua das Flores, 123 - São Paulo/SP',
    cpf: '123.456.789-00',
    dataNascimento: '15/03/1985',
    animaisIds: ['1', '2'], // Thor e Luna
  },
  {
    id: 'tutor2',
    nome: 'Carlos Mendes',
    email: 'carlos@clivovet.com',
    tipo: 'tutor',
    token: 'mock-token-tutor-456',
    telefone: '(11) 97777-6666',
    endereco: 'Av. Paulista, 1000 - São Paulo/SP',
    cpf: '987.654.321-00',
    dataNascimento: '22/07/1990',
    animaisIds: ['3'], // Rex
  },
  {
    id: 'tutor3',
    nome: 'Fernanda Lima',
    email: 'fernanda@clivovet.com',
    tipo: 'tutor',
    token: 'mock-token-tutor-789',
    telefone: '(11) 95555-4444',
    endereco: 'Rua Augusta, 500 - São Paulo/SP',
    cpf: '456.789.123-00',
    animaisIds: ['4'], // Mia
  },
];