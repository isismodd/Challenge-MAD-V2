export type Consulta = {
  id: string;
  animalId: string;
  animalNome: string;
  tutorId: string;
  tutorNome: string;
  veterinarioId: string;
  veterinarioNome: string;
  data: string;
  horario: string;
  status: 'agendada' | 'realizada' | 'cancelada';
  observacoes?: string;
};

export const mockConsultas: Consulta[] = [
  {
    id: '1',
    animalId: '1',
    animalNome: 'Thor',
    tutorId: '2',
    tutorNome: 'Ana Souza',
    veterinarioId: '1',
    veterinarioNome: 'Dr. Carlos Silva',
    data: '2025-06-15',
    horario: '14:30',
    status: 'agendada',
  },
  {
    id: '2',
    animalId: '2',
    animalNome: 'Luna',
    tutorId: '2',
    tutorNome: 'Ana Souza',
    veterinarioId: '1',
    veterinarioNome: 'Dr. Carlos Silva',
    data: '2025-06-20',
    horario: '10:00',
    status: 'agendada',
  },
];