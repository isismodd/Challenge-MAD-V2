
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type User = {
  id: string;
  nome: string;
  email: string;
  tipo: 'vet' | 'tutor';
  token: string;
};

type AuthContextData = {
  user: User | null;
  loading: boolean;
  login: (email: string, senha: string) => Promise<boolean>;
  logout: () => Promise<void>;
  userType: 'vet' | 'tutor' | null;
};

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarUsuarioSalvo();
  }, []);

  const carregarUsuarioSalvo = async () => {
    try {
      const token = await AsyncStorage.getItem('@ClivoVet:token');
      const userData = await AsyncStorage.getItem('@ClivoVet:userData');
      
      if (token && userData) {
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.log('Erro ao carregar usuário:', error);
    } finally {
      setLoading(false);
    }
  };

  
  const identificarTipoUsuario = (email: string): 'vet' | 'tutor' => {
    const emailLower = email.toLowerCase();
    
    // Lista de emails que são veterinários
    const emailsVet = [
      'vet@clivovet.com', 
      'veterinario@clivovet.com', 
      'dr@clivovet.com',
      'carlos@clivovet.com',
      'mariana@clivovet.com'
    ];
    
    // Lista de emails que são tutores
    const emailsTutor = [
      'tutor@clivovet.com', 
      'cliente@clivovet.com',
      'ana@clivovet.com',
      'carlos.mendes@clivovet.com'
    ];
    
    // Verifica se está na lista de veterinários
    if (emailsVet.includes(emailLower)) {
      return 'vet';
    }
    
    // Verifica se está na lista de tutores
    if (emailsTutor.includes(emailLower)) {
      return 'tutor';
    }
    
    // Se não está nas listas, verificar palavras-chave
    if (emailLower.includes('tutor')) {
      return 'tutor';
    }
    
    if (emailLower.includes('vet') && !emailLower.includes('tutor')) {
      return 'vet';
    }
    
    // Padrão: tutor
    return 'tutor';
  };

  const getUserMock = (email: string, tipo: 'vet' | 'tutor'): User => {
    if (tipo === 'vet') {
      return {
        id: '1',
        nome: 'Dr. Carlos Silva',
        email: email,
        tipo: 'vet',
        token: `mock-token-vet-${Date.now()}`,
      };
    } else {
      return {
        id: '2',
        nome: 'Ana Souza',
        email: email,
        tipo: 'tutor',
        token: `mock-token-tutor-${Date.now()}`,
      };
    }
  };

  const login = async (email: string, senha: string): Promise<boolean> => {
    setLoading(true);
    
    // Mock: aceita qualquer email/senha não vazios
    if (!email || !senha) {
      setLoading(false);
      return false;
    }

    const tipo = identificarTipoUsuario(email);
    const userMock = getUserMock(email, tipo);
    
    try {
      await AsyncStorage.setItem('@ClivoVet:token', userMock.token);
      await AsyncStorage.setItem('@ClivoVet:userData', JSON.stringify(userMock));
      setUser(userMock);
      return true;
    } catch (error) {
      console.log('Erro no login:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await AsyncStorage.removeItem('@ClivoVet:token');
      await AsyncStorage.removeItem('@ClivoVet:userData');
      setUser(null);
    } catch (error) {
      console.log('Erro ao fazer logout:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        userType: user?.tipo || null,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);