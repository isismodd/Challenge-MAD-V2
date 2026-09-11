// src/view/vet/VetNavigator.tsx
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, Button, StyleSheet, Image } from 'react-native';
import { useAuth } from '../../control/AuthContext';

// Importação das telas
import PerfilAnimaisScreen from './PerfilAnimaisScreen';
import AgendaScreen from './AgendaScreen';
import SaudePreventivaScreen from './SaudePreventivaScreen';
import { IMAGES } from '../../assets';

// ...
<Image source={IMAGES.clyvoLogo} style={styles.logo} resizeMode="contain" />

const Tab = createBottomTabNavigator();

// Header customizado com a logo centralizada
function LogoHeader() {
  return (
    <View style={styles.headerContainer}>
      <Image
        source={require('../../../assets/clyvoLogo.png')}
        style={{ width: 160, height: 50 }}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: '#2359D4',
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  // ... outros estilos
});

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
    <Tab.Navigator
      screenOptions={{
        headerShown: true,
        header: () => <LogoHeader />,
        headerStyle: {
          backgroundColor: '#2359D4',
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarActiveTintColor: '#2359D4',
        tabBarInactiveTintColor: '#999',
        tabBarStyle: {
          backgroundColor: '#fff',
          paddingBottom: 29,
          paddingTop: 5,
          height: 97,
        },
      }}
    >
      <Tab.Screen name="Início" component={HomeScreen}
        options={{ tabBarIcon: () => <Text style={{ fontSize: 22 }}>🏠</Text> }} />
      <Tab.Screen name="Animais" component={PerfilAnimaisScreen}
        options={{ tabBarIcon: () => <Text style={{ fontSize: 22 }}>🐕</Text> }} />
      <Tab.Screen name="Agenda" component={AgendaScreen}
        options={{ tabBarIcon: () => <Text style={{ fontSize: 22 }}>📅</Text> }} />
      <Tab.Screen name="Saúde" component={SaudePreventivaScreen}
        options={{ tabBarIcon: () => <Text style={{ fontSize: 22 }}>🔔</Text> }} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: '#2359D4',
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  logo: {
    width: 160,
    height: 50,
  },
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
    color: '#2359D4',
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