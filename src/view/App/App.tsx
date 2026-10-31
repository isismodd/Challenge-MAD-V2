import React from 'react';
import { NavigationContainer, DarkTheme, DefaultTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from '../../control/AuthContext';
import { ThemeProvider, useTheme } from '../../control/ThemeContext';
import { View, ActivityIndicator } from 'react-native';

import LoginScreen from '../../view/login/LoginScreen';
import CadastroScreen from '../../view/login/CadastroScreen';
import VetNavigator from '../../view/vet/VetNavigator';
import CadastroAnimalScreen from '../../view/vet/CadastroAnimalScreen';
import DetalhesAnimalScreen from '../../view/vet/DetalhesAnimalScreen';
import CadastroConsultaScreen from '../../view/vet/CadastroConsultaScreen';
import DetalhesConsultaScreen from '../../view/vet/DetalhesConsultaScreen';
import SobreScreen from '../../view/vet/SobreScreen';

const Stack = createStackNavigator();
const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, refetchOnWindowFocus: false, staleTime: 1000 * 60 * 5 } },
});

function AppNavigator() {
  const { user, loading } = useAuth();
  const { theme, colors } = useTheme();

  if (loading) return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );

  const navTheme = theme === 'dark' ? {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      background: colors.background,
      card: colors.card,
      text: colors.text,
      border: colors.border,
      primary: colors.primary,
    }
  } : {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: colors.background,
      card: colors.card,
      text: colors.text,
      border: colors.border,
      primary: colors.primary,
    }
  };

  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator screenOptions={{ headerShown: true }}>
        {!user ? (
          <>
            <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Cadastro" component={CadastroScreen} options={{ title: 'Cadastro' }} />
          </>
        ) : (
          <>
            <Stack.Screen name="VetApp" component={VetNavigator} options={{ headerShown: false }} />
            <Stack.Screen name="CadastroAnimal" component={CadastroAnimalScreen} options={{ title: 'Novo Animal' }} />
            <Stack.Screen name="EditarAnimal" component={CadastroAnimalScreen} options={{ title: 'Editar Animal' }} />
            <Stack.Screen name="DetalhesAnimal" component={DetalhesAnimalScreen} options={{ title: 'Detalhes do Animal' }} />
            <Stack.Screen name="NovaConsulta" component={CadastroConsultaScreen} options={{ title: 'Nova Consulta' }} />
            <Stack.Screen name="EditarConsulta" component={CadastroConsultaScreen} options={{ title: 'Editar Consulta' }} />
            <Stack.Screen name="DetalhesConsulta" component={DetalhesConsultaScreen} options={{ title: 'Detalhes da Consulta' }} />
            <Stack.Screen name="Sobre" component={SobreScreen} options={{ title: 'Sobre o App' }} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <AppNavigator />
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}