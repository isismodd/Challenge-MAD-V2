
export type Consulta = {
  id: string;
  animalId: string;
  animalNome: string;
  animalEspecie: string;
  tutorId: string;
  tutorNome: string;
  veterinarioId: string;
  veterinarioNome: string;
  data: string;
  horario: string;
  status: 'agendada' | 'realizada' | 'cancelada';
  observacoes?: string;
};

// Dados mockados de consultas
export const mockConsultas: Consulta[] = [
  {
    id: '1',
    animalId: '1',
    animalNome: 'Thor',
    animalEspecie: 'cachorro',
    tutorId: 'tutor1',
    tutorNome: 'Ana Souza',
    veterinarioId: '1',
    veterinarioNome: 'Dr. Carlos Silva',
    data: '2025-06-15',
    horario: '09:00',
    status: 'agendada',
    observacoes: 'Vacinação anual',
  },
  {
    id: '2',
    animalId: '2',
    animalNome: 'Luna',
    animalEspecie: 'gato',
    tutorId: 'tutor1',
    tutorNome: 'Ana Souza',
    veterinarioId: '1',
    veterinarioNome: 'Dr. Carlos Silva',
    data: '2025-06-15',
    horario: '10:30',
    status: 'agendada',
    observacoes: 'Check-up',
  },
  {
    id: '3',
    animalId: '3',
    animalNome: 'Rex',
    animalEspecie: 'cachorro',
    tutorId: 'tutor2',
    tutorNome: 'Carlos Mendes',
    veterinarioId: '1',
    veterinarioNome: 'Dr. Carlos Silva',
    data: '2025-06-16',
    horario: '14:00',
    status: 'agendada',
    observacoes: 'Retorno pós-cirúrgico',
  },
];