import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authService } from '../services/authService';

type User = { id: string; nome: string; email: string; role: 'ADMIN' | 'VETERINARIO'; };
type AuthContextData = {
  user: User | null; loading: boolean;
  login: (email: string, senha: string) => Promise<boolean>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { carregarUsuarioSalvo(); }, []);

  const carregarUsuarioSalvo = async () => {
    try {
      const token = await AsyncStorage.getItem('@ClyvoPet:token');
      const userData = await AsyncStorage.getItem('@ClyvoPet:userData');
      if (token && userData) setUser(JSON.parse(userData));
    } catch (e) { console.log(e); }
    finally { setLoading(false); }
  };

  const login = async (email: string, senha: string): Promise<boolean> => {
    setLoading(true);
    try {
      const data = await authService.login(email, senha);
      const loggedUser: User = {
        id: data.user.id, nome: data.user.nome,
        email: data.user.email, role: data.user.role,
      };
      await AsyncStorage.setItem('@ClyvoPet:token', data.token);
      await AsyncStorage.setItem('@ClyvoPet:userData', JSON.stringify(loggedUser));
      setUser(loggedUser);
      return true;
    } catch (e) { console.log('Erro login:', e); return false; }
    finally { setLoading(false); }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await AsyncStorage.removeItem('@ClyvoPet:token');
      await AsyncStorage.removeItem('@ClyvoPet:userData');
      setUser(null);
    } catch (e) { console.log(e); }
    finally { setLoading(false); }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);