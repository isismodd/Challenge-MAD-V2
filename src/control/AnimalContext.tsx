// src/control/AnimalContext.tsx
import React, { createContext, useState, useContext, ReactNode } from 'react';

export type Animal = {
  id: string;
  nome: string;
  especie: 'cachorro' | 'gato' | 'outro';
  raca: string;
  idade: number;
  peso: number;
  vacinasEmDia: boolean;
  observacoes?: string;
  proximaConsulta?: string | null;
};

type AnimalContextData = {
  animais: Animal[];
  adicionarAnimal: (animal: Animal) => void;
  removerAnimal: (id: string) => void;
  editarAnimal: (animal: Animal) => void;
};

const AnimalContext = createContext<AnimalContextData>({} as AnimalContextData);

export const AnimalProvider = ({ children }: { children: ReactNode }) => {
  const [animais, setAnimais] = useState<Animal[]>([
    {
      id: '1',
      nome: 'Thor',
      especie: 'cachorro',
      raca: 'Labrador',
      idade: 3,
      peso: 28.5,
      vacinasEmDia: true,
      proximaConsulta: '15/06/2026',
    },
    {
      id: '2',
      nome: 'Lesada',
      especie: 'gato',
      raca: 'SRD',
      idade: 3,
      peso: 2.5,
      vacinasEmDia: true,
      proximaConsulta: '20/06/2026',
    },
    {
      id: '3',
      nome: 'Bob',
      especie: 'cachorro',
      raca: 'Poodle',
      idade: 5,
      peso: 6.5,
      vacinasEmDia: false,
      proximaConsulta: null,
    },
  ]);

  const adicionarAnimal = (animal: Animal) => {
    setAnimais(prev => [animal, ...prev]);
  };

  const removerAnimal = (id: string) => {
    setAnimais(prev => prev.filter(animal => animal.id !== id));
  };

  const editarAnimal = (animalAtualizado: Animal) => {
    setAnimais(prev =>
      prev.map(animal =>
        animal.id === animalAtualizado.id ? animalAtualizado : animal
      )
    );
  };

  return (
    <AnimalContext.Provider
      value={{
        animais,
        adicionarAnimal,
        removerAnimal,
        editarAnimal,
      }}
    >
      {children}
    </AnimalContext.Provider>
  );
};

export const useAnimais = () => useContext(AnimalContext);