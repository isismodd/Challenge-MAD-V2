// src/view/vet/VetNavigator.tsx
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, TouchableOpacity, StyleSheet, Image, ImageBackground } from 'react-native';
import { useAuth } from '../../control/AuthContext';

import PerfilAnimaisScreen from './PerfilAnimaisScreen';
import AgendaScreen from './AgendaScreen';
import SaudePreventivaScreen from './SaudePreventivaScreen';

const Tab = createBottomTabNavigator();

// Header customizado com a logo centralizada
function LogoHeader() {
  return (
    <View style={styles.headerContainer}>
      <Image
        source={require('../../../assets/clyvoLogo.png')}
        style={styles.logo}
        resizeMode="contain"
      />
    </View>
  );
}

// Tela de Início com imagem de fundo + overlay preto
function HomeScreen() {
  const { logout } = useAuth();

  return (
    <ImageBackground
      source={require('../../../assets/homeBG.jpg')}
      style={styles.background}
      resizeMode="cover"
    >
      {/* Overlay preto com 50% de opacidade */}
      <View style={styles.overlay} />

      {/* Conteúdo da Home */}
      <View style={styles.content}>
        <Text style={styles.welcome}>Bem-vindo ao ClyvoPet</Text>
        <Text style={styles.subtitle}>Sistema de gestão para clínica veterinária</Text>

        {/* Botão de Logout customizado */}
        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <Text style={styles.logoutButtonText}>LOGOUT</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
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
  // Imagem de fundo ocupando toda a tela
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  // Overlay preto com 50% de opacidade
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  // Conteúdo por cima do overlay
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  welcome: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#e7edfd',
    textAlign: 'center',
    marginBottom: 40,
  },
  // Botão de logout customizado
  logoutButton: {
    marginTop: 20,
    width: '80%',
    backgroundColor: '#e7edfd',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutButtonText: {
    color: '#112942',       // ← Cor do texto solicitada
    fontWeight: 'bold',
    fontSize: 16,
  },
});