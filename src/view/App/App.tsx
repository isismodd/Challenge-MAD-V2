// src/view/App/App.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthProvider, useAuth } from '../../control/AuthContext';
import { View, ActivityIndicator } from 'react-native';

import LoginScreen from '../../view/login/LoginScreen';
import VetNavigator from '../../view/vet/VetNavigator';
import TutorNavigator from '../../view/tutor/TutorNavigator';

const Stack = createStackNavigator();

function AppNavigator() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!user ? (
        <Stack.Screen name="Login" component={LoginScreen} />
      ) : user.tipo === 'vet' ? (
        <Stack.Screen name="VetApp" component={VetNavigator} />
      ) : (
        <Stack.Screen name="TutorApp" component={TutorNavigator} />
      )}
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}