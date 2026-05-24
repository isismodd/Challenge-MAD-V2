export type Animal = {
  id: string;
  nome: string;
  especie: 'cachorro' | 'gato' | 'outro';
  raca: string;
  idade: number;
  peso: number;
  tutorId: string;
  tutorNome: string;
  planoSaude?: string;
  beneficios?: string[];
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
    tutorId: '2',
    tutorNome: 'Ana Souza',
    planoSaude: 'PetLove Premium',
    beneficios: ['Vacinas anuais', 'Consultas grátis'],
  },
  {
    id: '2',
    nome: 'Luna',
    especie: 'gato',
    raca: 'Siamês',
    idade: 2,
    peso: 4.2,
    tutorId: '2',
    tutorNome: 'Ana Souza',
    planoSaude: 'PetLove Basic',
  },
];