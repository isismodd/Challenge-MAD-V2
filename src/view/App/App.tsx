import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthProvider, useAuth } from '../../control/AuthContext';


// Importar as telas 
import LoginScreen from '../../view/login/LoginScreen';
import SelecaoPerfilScreen from '../../view/login/SelecaoPerfilScreen';
import VetNavigator from '../../view/vet/VetNavigator';
import TutorNavigator from '../../view/tutor/TutorNavigator';

const Stack = createStackNavigator();

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Login"
          screenOptions={{
            headerStyle: { backgroundColor: '#4CAF50' },
            headerTintColor: '#fff',
            headerTitleStyle: { fontWeight: 'bold' },
          }}
        >
          <Stack.Screen 
            name="Login" 
            component={LoginScreen} 
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="SelecaoPerfil" 
            component={SelecaoPerfilScreen} 
            options={{ title: 'Selecionar Perfil' }}
          />
          <Stack.Screen 
            name="VetApp" 
            component={VetNavigator} 
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="TutorApp" 
            component={TutorNavigator} 
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
}