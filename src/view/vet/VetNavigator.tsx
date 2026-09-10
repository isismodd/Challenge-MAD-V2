import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useAuth } from '../../control/AuthContext';

import perfilAnimaisScreen from './perfilAnimaisScreen';
import AgendaScreen from './AgendaScreen';
import SaudePreventivaScreen from './SaudePreventivaScreen';

const Tab = createBottomTabNavigator();

function HomeScreen() {
  const { user, logout } = useAuth();
  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>Bem-vindo, {user?.nome || 'Veterinário'}! 👋</Text>
      <Text style={styles.subtitle}>Logado como {user?.role || 'VETERINARIO'}</Text>
      <View style={styles.infoBox}>
        <Text style={styles.infoText}>📧 {user?.email}</Text>
      </View>
      <View style={styles.logoutButton}>
        <Button title="Sair do App" onPress={logout} color="#ff4444" />
      </View>
    </View>
  );
}

export default function VetNavigator() {
  return (
    <Tab.Navigator screenOptions={{
      tabBarActiveTintColor: '#3b82f6',
      tabBarInactiveTintColor: '#999',
      tabBarStyle: { backgroundColor: '#fff', paddingBottom: 29, paddingTop: 5, height: 97 },
      headerStyle: { backgroundColor: '#3b82f6' },
      headerTintColor: '#fff',
      headerTitleStyle: { fontWeight: 'bold' },
    }}>
      <Tab.Screen name="Início" component={HomeScreen}
        options={{ tabBarIcon: () => <Text style={{ fontSize: 22 }}>🏠</Text> }} />
      <Tab.Screen name="Animais" component={perfilAnimaisScreen}
        options={{ tabBarIcon: () => <Text style={{ fontSize: 22 }}>🐕</Text> }} />
      <Tab.Screen name="Agenda" component={AgendaScreen}
        options={{ tabBarIcon: () => <Text style={{ fontSize: 22 }}>📅</Text> }} />
      <Tab.Screen name="Saúde" component={SaudePreventivaScreen}
        options={{ tabBarIcon: () => <Text style={{ fontSize: 22 }}>🔔</Text> }} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: '#f5f5f5' },
  welcome: { fontSize: 24, fontWeight: 'bold', color: '#1e3a8a', marginBottom: 10, textAlign: 'center' },
  subtitle: { fontSize: 16, color: '#666', textAlign: 'center', marginBottom: 10 },
  infoBox: { backgroundColor: '#fff', padding: 15, borderRadius: 10, marginTop: 20, marginBottom: 30, width: '100%', alignItems: 'center', elevation: 3 },
  infoText: { fontSize: 14, color: '#333', marginVertical: 3 },
  logoutButton: { marginTop: 20, width: '80%' },
});