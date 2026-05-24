export type Animal = {
  id: string;
  nome: string;
  especie: 'cachorro' | 'gato' | 'outro';
  raca: string;
  idade: number;
  peso: number;
  tutorId: string;
  tutorNome: string;
  vacinasEmDia: boolean;
  ultimaConsulta?: string;
  planoSaude?: string;
  observacoes?: string;
};

export const mockAnimais: Animal[] = [
  {
    id: '1',
    nome: 'Thor',
    especie: 'cachorro',
    raca: 'Labrador',
    idade: 3,
    peso: 28.5,
    tutorId: 'tutor1',
    tutorNome: 'Ana Souza',
    vacinasEmDia: true,
    ultimaConsulta: '10/05/2025',
    planoSaude: 'Premium',
  },
  {
    id: '2',
    nome: 'Luna',
    especie: 'gato',
    raca: 'Siamês',
    idade: 2,
    peso: 4.2,
    tutorId: 'tutor1',
    tutorNome: 'Ana Souza',
    vacinasEmDia: false,
    ultimaConsulta: '15/04/2025',
    planoSaude: 'Basic',
  },
  {
    id: '3',
    nome: 'Rex',
    especie: 'cachorro',
    raca: 'Pastor Alemão',
    idade: 5,
    peso: 35.0,
    tutorId: 'tutor2',
    tutorNome: 'Carlos Mendes',
    vacinasEmDia: true,
    ultimaConsulta: '20/03/2025',
    planoSaude: 'Premium',
  },
  {
    id: '4',
    nome: 'Mia',
    especie: 'gato',
    raca: 'Persa',
    idade: 4,
    peso: 3.8,
    tutorId: 'tutor3',
    tutorNome: 'Fernanda Lima',
    vacinasEmDia: true,
    ultimaConsulta: '05/05/2025',
    planoSaude: 'Premium',
  },
];