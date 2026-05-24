import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../Model/User';

type AuthContextData = {
  user: User | null;
  loading: boolean;
  login: (email: string, senha: string, tipo: 'vet' | 'tutor') => Promise<boolean>;
  logout: () => Promise<void>;
  userType: 'vet' | 'tutor' | null;
};

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [userType, setUserType] = useState<'vet' | 'tutor' | null>(null);

  // Carregar token e dados salvos ao iniciar o app
  useEffect(() => {
    carregarDadosSalvos();
  }, []);

  const carregarDadosSalvos = async () => {
    try {
      const token = await AsyncStorage.getItem('@ClivoVet:token');
      const tipo = await AsyncStorage.getItem('@ClivoVet:userType');
      const userData = await AsyncStorage.getItem('@ClivoVet:userData');
      
      if (token && tipo && userData) {
        setUser(JSON.parse(userData));
        setUserType(tipo as 'vet' | 'tutor');
      }
    } catch (error) {
      console.log('Erro ao carregar dados salvos:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, senha: string, tipo: 'vet' | 'tutor'): Promise<boolean> => {
    try {
      // Mock de usuários para teste
      const mockUsers = {
        vet: {
          id: '1',
          nome: 'Dr. Carlos Silva',
          email: 'vet@clivovet.com',
          tipo: 'vet' as const,
          token: 'mock-token-vet-123',
          especialidade: 'Clínico Geral',
          crv: '12345'
        },
        tutor: {
          id: '2',
          nome: 'Ana Souza',
          email: 'tutor@clivovet.com',
          tipo: 'tutor' as const,
          token: 'mock-token-tutor-123',
          telefone: '(11) 99999-9999'
        }
      };

      // Simular validação de login (aceita qualquer email/senha para teste)
      if (!email || !senha) {
        throw new Error('Preencha email e senha');
      }

      const userMock = mockUsers[tipo];
      
      // Salvar no AsyncStorage
      await AsyncStorage.setItem('@ClivoVet:token', userMock.token);
      await AsyncStorage.setItem('@ClivoVet:userType', tipo);
      await AsyncStorage.setItem('@ClivoVet:userData', JSON.stringify(userMock));
      
      setUser(userMock);
      setUserType(tipo);
      
      return true;
    } catch (error) {
      console.log('Erro no login:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('@ClivoVet:token');
      await AsyncStorage.removeItem('@ClivoVet:userType');
      await AsyncStorage.removeItem('@ClivoVet:userData');
      
      setUser(null);
      setUserType(null);
    } catch (error) {
      console.log('Erro ao fazer logout:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, userType }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);