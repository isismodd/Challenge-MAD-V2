import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from 'react-native';

type ThemeType = 'light' | 'dark';

interface ThemeContextData {
  theme: ThemeType;
  toggleTheme: () => void;
  colors: {
    background: string;
    card: string;
    text: string;
    textSecondary: string;
    primary: string;
    border: string;
    header: string;
    button: string;
    buttonText: string;
  };
}

const lightColors = {
  background: '#f5f5f5',
  card: '#ffffff',
  text: '#333333',
  textSecondary: '#666666',
  primary: '#1e3a8a',
  border: '#dddddd',
  header: '#60a5fa',
  button: '#1e3a8a',
  buttonText: '#ffffff',
};

const darkColors = {
  background: '#121212',
  card: '#1e1e1e',
  text: '#e0e0e0',
  textSecondary: '#a0a0a0',
  primary: '#3b82f6',
  border: '#333333',
  header: '#1e3a8a',
  button: '#3b82f6',
  buttonText: '#ffffff',
};

const ThemeContext = createContext<ThemeContextData>({} as ThemeContextData);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const systemColorScheme = useColorScheme();
  const [theme, setTheme] = useState<ThemeType>('light');

  useEffect(() => {
    carregarTema();
  }, []);

  const carregarTema = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('@ClyvoPet:theme');
      if (savedTheme === 'light' || savedTheme === 'dark') {
        setTheme(savedTheme);
      } else if (systemColorScheme) {
        setTheme(systemColorScheme);
      }
    } catch (e) {
      console.log('Erro ao carregar tema', e);
    }
  };

  const toggleTheme = async () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    try {
      await AsyncStorage.setItem('@ClyvoPet:theme', newTheme);
    } catch (e) {
      console.log('Erro ao salvar tema', e);
    }
  };

  const colors = theme === 'light' ? lightColors : darkColors;

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);