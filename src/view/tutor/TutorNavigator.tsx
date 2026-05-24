// src/view/tutor/TutorNavigator.tsx
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useAuth } from '../../control/AuthContext';

// Importação das telas prontas
import MeusAnimaisScreen from './MeusAnimaisScreen';
import CadastroAnimaisScreen from './CadastroAnimaisScreen';
import ChatScreen from './ChatScreen';
import ComunidadeScreen from './ComunidadeScreen';
import BeneficiosScreen from './BeneficiosScreen';

const Tab = createBottomTabNavigator();

// Tela Início com informações do usuário e logout
function HomeScreen() {
  const { user, logout } = useAuth();
  
  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>Bem-vindo, {user?.nome || 'Tutor'}! 👋</Text>
      <Text style={styles.subtitle}>Você está logado como TUTOR</Text>
      
      <View style={styles.infoBox}>
        <Text style={styles.infoText}>📧 {user?.email || 'tutor@clivovet.com'}</Text>
        <Text style={styles.infoText}>🎫 {user?.token?.substring(0, 25) || 'mock-token-tutor'}...</Text>
      </View>
      
      <View style={styles.logoutButton}>
        <Button title="Sair do App" onPress={logout} color="#ff4444" />
      </View>
    </View>
  );
}

export default function TutorNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#2196F3',
        tabBarInactiveTintColor: '#999',
        tabBarStyle: {
          backgroundColor: '#fff',
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        headerStyle: {
          backgroundColor: '#2196F3',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Tab.Screen 
        name="Início" 
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Text style={{ fontSize: 22 }}>{focused ? '🏠' : '🏠'}</Text>
          ),
        }}
      />
      <Tab.Screen 
        name="Meus Pets" 
        component={MeusAnimaisScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Text style={{ fontSize: 22 }}>{focused ? '🐕' : '🐕'}</Text>
          ),
        }}
      />
      <Tab.Screen 
        name="Cadastrar Pet" 
        component={CadastroAnimaisScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Text style={{ fontSize: 22 }}>{focused ? '📝' : '📝'}</Text>
          ),
        }}
      />
      <Tab.Screen 
        name="Chat" 
        component={ChatScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Text style={{ fontSize: 22 }}>{focused ? '💬' : '💬'}</Text>
          ),
        }}
      />
      <Tab.Screen 
        name="Comunidade" 
        component={ComunidadeScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Text style={{ fontSize: 22 }}>{focused ? '🌐' : '🌐'}</Text>
          ),
        }}
      />
      <Tab.Screen 
        name="Benefícios" 
        component={BeneficiosScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Text style={{ fontSize: 22 }}>{focused ? '🎁' : '🎁'}</Text>
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  welcome: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2196F3',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 10,
  },
  infoBox: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    marginBottom: 30,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoText: {
    fontSize: 14,
    color: '#333',
    marginVertical: 3,
  },
  logoutButton: {
    marginTop: 20,
    width: '80%',
  },
});