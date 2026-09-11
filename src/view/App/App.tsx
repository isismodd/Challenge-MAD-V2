import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from '../../control/AuthContext';
import { View, ActivityIndicator } from 'react-native';

import LoginScreen from '../../view/login/LoginScreen';
import CadastroScreen from '../../view/login/CadastroScreen';
import VetNavigator from '../../view/vet/VetNavigator';
import CadastroAnimalScreen from '../../view/vet/CadastroAnimalScreen';
import DetalhesAnimalScreen from '../../view/vet/DetalhesAnimalScreen';
import CadastroConsultaScreen from '../../view/vet/CadastroConsultaScreen';
import DetalhesConsultaScreen from '../../view/vet/DetalhesConsultaScreen';

const Stack = createStackNavigator();
const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, refetchOnWindowFocus: false, staleTime: 1000 * 60 * 5 } },
});

function AppNavigator() {
  const { user, loading } = useAuth();
  if (loading) return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color="#1e3a8a" />
    </View>
  );

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!user ? (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Cadastro" component={CadastroScreen}
            options={{ headerShown: true, title: 'Cadastro' }} />
        </>
      ) : (
        <>
          <Stack.Screen name="VetApp" component={VetNavigator} />
          <Stack.Screen name="CadastroAnimal" component={CadastroAnimalScreen}
            options={{ headerShown: true, title: 'Novo Animal' }} />
          <Stack.Screen name="EditarAnimal" component={CadastroAnimalScreen}
            options={{ headerShown: true, title: 'Editar Animal' }} />
          <Stack.Screen name="DetalhesAnimal" component={DetalhesAnimalScreen}
            options={{ headerShown: true, title: 'Detalhes do Animal' }} />
          <Stack.Screen name="NovaConsulta" component={CadastroConsultaScreen}
            options={{ headerShown: true, title: 'Nova Consulta' }} />
          <Stack.Screen name="EditarConsulta" component={CadastroConsultaScreen}
            options={{ headerShown: true, title: 'Editar Consulta' }} />
          <Stack.Screen name="DetalhesConsulta" component={DetalhesConsultaScreen}
            options={{ headerShown: true, title: 'Detalhes da Consulta' }} />
        </>
      )}
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </AuthProvider>
    </QueryClientProvider>
  );
}